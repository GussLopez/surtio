"use client"

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavSettings({
  settings,
}: {
  settings: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const path = usePathname();
  const activeClasses = 'text-primary bg-primary/10 hover:bg-primary/10! hover:text-primary!'
  return (
    <SidebarGroup>
      {settings.length > 0 && <SidebarGroupLabel>Administración</SidebarGroupLabel>}
      <SidebarMenu>
        {settings.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link href={item.url} className={`${path === item.url && activeClasses}`}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
