"use client"
import * as React from "react"

import { NavMain } from "@/features/sidebar/components/nav-main"
import { NavProjects } from "@/features/sidebar/components/nav-projects"
import { NavUser } from "@/features/sidebar/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/shared/components/ui/sidebar";
import { NavSettings } from "@/features/sidebar/components/nav-settings";
import { BusinessSwitcher } from "./business-switcher";
import { useUserStore } from "@/shared/store/UserStore";
import { data } from "../data"

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
