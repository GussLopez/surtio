import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { businessId, categoryId, search, page = 1, pageSize = 10 } = await req.json();

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
      .from("products")
      .select(
        `
        *,
        categories (id, name)
      `,
      { count: "exact" }
      )
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search?.trim()) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
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
