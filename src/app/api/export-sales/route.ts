import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";
export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const businessId = searchParams.get("business_id");

  let query = supabase
    .from("sales")
    .select(
      `
      id,
      sale_number,
      total,
      payment_method,
      created_at,
      seller_name,
      sale_items (
        quantity,
        price,
        products:products (
          name,
          sku
        )
      )
    `,
    )
    .eq("status", "completed")
    .eq("business_id", businessId);

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  if (!data || data.length === 0) {
    return new Response(
      JSON.stringify({ error: "No hay ventas en este rango de fechas" }),
      { status: 400 },
    );
  }
  const rows: any[] = [];
  data.forEach((sale) => {
    sale.sale_items?.forEach((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      rows.push({
        sale_number: sale.sale_number,
        date: sale.created_at,
        seller: sale.seller_name,
        product: product?.name ?? "",
        sku: product?.sku ?? "",
        quantity: item.quantity,
        price: item.price,
        total_sale: sale.total,
        payment_method: sale.payment_method,
      });
    });
  });
  if (rows.length === 0) {
    return new Response(
      JSON.stringify({ error: "No hay productos en las ventas seleccionadas" }),
      { status: 400 },
    );
  }

  const csv = Papa.unparse(rows, {
    columns: [
      "sale_number",
      "date",
      "seller",
      "product",
      "sku",
      "quantity",
      "price",
      "total_sale",
      "payment_method",
    ],
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="sales.csv"',
    },
  });
}
