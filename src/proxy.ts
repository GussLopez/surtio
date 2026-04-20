import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin/admin": ["owner", "admin", "seller", "stock-man"],
  "/admin/usuarios": ["owner", "admin"],
  "/admin/ajustes": ["owner"],
  "/admin/inventario": ["owner", "admin", "stock-man", "seller"],
  "/admin/entradas-salidas": ["owner", "admin", "stock-man"],
  "/admin/proveedores": ["owner", "admin", "stock-man"],
  "/admin/ventas": ["owner", "admin", "seller"],
  "/admin/historial-ventas": ["owner", "admin", "seller"],
  "/admin/new": ["owner"],
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const businessId = request.cookies.get("active_business_id")?.value;
  
  if (user && pathname.startsWith("/admin")) {
    let userRole = "seller";

    if (businessId) {
      const { data: membership } = await supabase
        .from("memberships")
        .select("role")
        .eq("user_id", user.id)
        .eq("business_id", businessId)
        .single();

      if (membership) {
        userRole = membership.role;
      }
    }

    const restrictedPath = Object.keys(ROLE_ROUTES).find((path) =>
      pathname.startsWith(path),
    );

    if (restrictedPath) {
      const allowedRoles = ROLE_ROUTES[restrictedPath];

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};