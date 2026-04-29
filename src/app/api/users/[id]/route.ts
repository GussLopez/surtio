import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { profileName, role, businessId } = await req.json();

    if (!id) {
      return Response.json({ error: "Id inválido" }, { status: 500 });
    }
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

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: profileName })
      .eq("id", id);

    if (profileError) {
      return Response.json({ error: profileError }, { status: 500 });
    }
    const { error: membershipError } = await supabase
      .from("memberships")
      .update({ role: role })
      .eq("user_id", id)
      .eq("business_id", businessId);

    if (membershipError) {
      return Response.json({ error: membershipError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Id inválido" }, { status: 500 });
    }
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
      .from("profiles")
      .select(
        `
        *,
        memberships (role)
      `,
      )
      .eq("id", id)
      .single();

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
