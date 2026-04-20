import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { userId, businessId, dateRange } = await req.json();
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
      .from("inventory_movements")
      .select(
        `
      *,
      profiles (
        id,
        full_name
      ),
      products (
        name,
        sku
      )
    `,
      )
      .eq("business_id", businessId);
    if (userId && userId !== "ninguno") {
      query = query.eq("user_id", userId);
    }

    if (dateRange?.from) {
      query = query.gte("created_at", dateRange.from.toISOString());
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
    return Response.json(data);
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
