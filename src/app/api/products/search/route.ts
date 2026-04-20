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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { businessId, categoryId, search } = await req.json();

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (id, name)
      `)
      .eq("business_id", businessId);

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

  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
