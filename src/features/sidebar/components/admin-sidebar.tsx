"use client"
import * as React from "react"
import {
  ArrowRightLeft,
  DollarSign,
  FileClock,
  LayoutTemplate,
  Package,
  Settings2,
  Truck,
  Users,
} from "lucide-react";

import { NavMain } from "@/features/sidebar/components/nav-main"
import { NavProjects } from "@/features/sidebar/components/nav-projects"
import { NavUser } from "@/features/sidebar/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/shared/components/ui/sidebar";
import { NavSettings } from "@/features/sidebar/components/nav-settings";
import { BusinessSwitcher } from "./business-switcher";
import { useUserStore } from "@/shared/store/UserStore";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/admin",
      icon: LayoutTemplate,
      roles: ["owner", "admin", "stock-man", "seller"]
    },
    {
      title: "Ventas",
      url: "/admin/ventas",
      icon: DollarSign,
      roles: ["owner", "admin", "seller"]
    },
    {
      title: "Historial de Ventas",
      url: "/admin/historial-ventas",
      icon: FileClock,
      roles: ["owner", "admin", "seller"]
    },
    /* {
      title: "Reportes",
      url: "/admin/reportes",
      icon: ChartNoAxesCombined,
    }, */
    /* {
      title: "Operaciones",
      url: "/admin/operaciones",
      icon: BookOpen,
    }, */
  ],
  projects: [
    {
      name: "Inventario",
      url: "/admin/inventario",
      icon: Package,
      roles: ["owner", "admin", "stock-man", "seller"]
    },
    {
      name: "Entradas y Salidas",
      url: "/admin/entradas-salidas",
      icon: ArrowRightLeft,
      roles: ["owner", "admin", "stock-man"]
    },
    {
      name: "Proveedores",
      url: "/admin/proveedores",
      icon: Truck,
      roles: ["owner", "admin", "stock-man"]
    },
  ],
  settings: [
    {
      name: "Usuarios",
      url: "/admin/usuarios",
      icon: Users,
      roles: ["owner"]
    },
    {
      name: "Ajustes",
      url: "/admin/ajustes",
      icon: Settings2,
      roles: ["owner"]
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userRole = useUserStore((state) => state.role);
  const filterByRole = (items: any[]) => 
    items.filter(item => !item.roles || item.roles.includes(userRole));
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filterByRole(data.navMain)} />
        <NavProjects projects={filterByRole(data.projects)} />
        <NavSettings settings={filterByRole(data.settings)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
