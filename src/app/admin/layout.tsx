import type { Metadata } from "next";
import { AuthContextProvider } from "@/features/auth/context/AuthContext";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "@/features/sidebar/components/admin-sidebar";
import { Separator } from "@/shared/components/ui/separator";
import SessionListener from "@/features/auth/components/SessionListener";
import ClientWrapper from "@/shared/components/ClientWrapper";

export const metadata: Metadata = {
  title: "Flyzzio - Admin",
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-input transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#F2F5F7] dark:bg-black">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthContextProvider >
    </ClientWrapper>
  );
}
