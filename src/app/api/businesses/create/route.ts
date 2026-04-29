import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { bData } = await req.json();
  
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
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) throw new Error("Usuario no autenticado");
  
    const payload = {
      ...bData,
    };
    const { data: businessId, error: rpcError } = await supabase.rpc(
      "create_business_with_membership",
      { business_data: payload },
    );
  
    if (rpcError) {
      return Response.json({ error: rpcError.message }, { status: 500 });
    }
  
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();
  
    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 });
    }
  
    return Response.json(business);
  } catch (err: any) {
    return Response.json(
      { error: err.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}
