import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { dateRange, businessId, page = 1, pageSize = 10 } = await req.json();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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
        { count: "exact" },
      )
      .eq("business_id", businessId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      query = query.gte("created_at", fromDate.toISOString());
    }

    if (dateRange?.to) {
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endOfDay.toISOString());
    }

    const { data, error, count } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({
      data, 
      total: count,
      page,
      pageSize
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
