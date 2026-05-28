"use client";
import { type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const path = usePathname();
  const activeClasses = 'text-primary bg-primary/10 hover:bg-primary/10! hover:text-primary!'
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, i) => (
          <SidebarMenuButton key={i} asChild tooltip={item.title}>
            <Link href={item.url} className={`${path === item.url && activeClasses}`} >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
