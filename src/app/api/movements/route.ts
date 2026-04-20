import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { movements } = await req.json();
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

    const { data, error } = await supabase
      .from("inventory_movements")
      .insert(movements)
      .select()
    
    if (error) {
      Response.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return Response.json(
        { error: "No tienes permisos para editar este producto" },
        { status: 403 },
      );
    }
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
