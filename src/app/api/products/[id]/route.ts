import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;

    if (!productId) {
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
      .from("products")
      .delete()
      .eq("id", productId)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: "No tienes permisos para eliminar este producto" },
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;
    const { product } = await req.json();
    if (!productId) {
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
      .from("products")
      .update(product)
      .eq("id", productId)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
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
