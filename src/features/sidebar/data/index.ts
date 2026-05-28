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

export const data = {
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