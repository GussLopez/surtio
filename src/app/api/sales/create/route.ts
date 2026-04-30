import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { paymentMethod, items, businessId, saleDate } =
      await req.json();
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
    const isoDate = new Date(saleDate).toISOString();
    const { data, error } = await supabase.rpc("create_sale", {
      p_payment_method: paymentMethod,
      p_items: items,
      p_business_id: businessId,
      p_created_at: isoDate,
    });

    if (error) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: "No tienes permisos para eliminar este producto" },
        { status: 403 },
      );
    }
    return Response.json(data);
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
