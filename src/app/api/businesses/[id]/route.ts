import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: "Id ínvalido" }, { status: 500 });
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
    .from("businesses")
    .select()
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
