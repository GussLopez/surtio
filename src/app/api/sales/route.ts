import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { dateRange, businessId } = await req.json();
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    let query = supabase
      .from("sales")
      .select(
        `
      *,
      sale_items (
        id,
        quantity,
        price,
        product_id,
        products (
          id,
          name,
          sku,
          cost
        )
      )
    `,
      )
      .eq("business_id", businessId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(10);

    if (dateRange?.from) {
      query = query.gte("created_at", dateRange.from?.toISOString());
    }

    if (dateRange?.to) {
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: "No tienes permisos para eliminar este producto" },
        { status: 403 },
      );
    }
  } catch {}
}
