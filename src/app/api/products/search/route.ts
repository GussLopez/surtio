import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
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
      }
    );
    const { businessId, categoryId, search = '' } = await req.json();

    if (!businessId) {
      return Response.json({ error: 'businessId is required' }, { status: 400 });
    }

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (id, name)
      `)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search?.trim()) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data, error } = await query;


    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);

  } catch (err: unknown) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
