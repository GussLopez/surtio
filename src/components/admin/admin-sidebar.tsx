"use client"
import * as React from "react"
import {
  ArrowRightLeft,
  BookOpen,
  ChartNoAxesCombined,
  DollarSign,
  FileClock,
  LayoutTemplate,
  Package,
  Settings2,
  Truck,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavUser } from "@/components/admin/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavSettings } from "./nav-settings";
import { BusinessSwitcher } from "./business-switcher";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/admin",
      icon: LayoutTemplate,
    },
    {
      title: "Ventas",
      url: "/admin/ventas",
      icon: DollarSign,
    },
    {
      title: "Historial de Ventas",
      url: "/admin/historial-ventas",
      icon: FileClock,
    },
    {
      title: "Reportes",
      url: "/admin/reportes",
      icon: ChartNoAxesCombined,
    },
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
    },
    {
      name: "Entradas y Salidas",
      url: "/admin/entradas-salidas",
      icon: ArrowRightLeft,
    },
    {
      name: "Proveedores",
      url: "/admin/proveedores",
      icon: Truck,
    },
  ],
  settings: [
    {
      name: "Usuarios",
      url: "/admin/usuarios",
      icon: Users,
    },
    {
      name: "Ajustes",
      url: "/admin/ajustes",
      icon: Settings2,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSettings settings={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
