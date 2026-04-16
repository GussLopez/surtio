import type { Metadata } from "next";
import { AuthContextProvider } from "@/context/AuthContext";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import SessionListener from "@/components/auth/SessionListener";
import ClientWrapper from "@/components/admin/ClientWrapper";

export const metadata: Metadata = {
  title: "Stock Pro - Admin",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientWrapper>
      <AuthContextProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SessionListener />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthContextProvider >
    </ClientWrapper>
  );
}
