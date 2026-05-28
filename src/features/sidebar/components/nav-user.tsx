"use client";
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Moon, Sparkles, Sun } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/features/sidebar/components/sidebar"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/AuthStore";
import { Skeleton } from "../../../components/ui/skeleton";
import { useUserStore } from "@/store/UserStore";

export function NavUser() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { isMobile } = useSidebar()
  const { nombres, email } = useUserStore();
  const signOut = useAuthStore((state) => state.signOut);
  const avatar = '/img/user/panda.png'
  async function handleSignOut() {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={nombres || 'avatar del usuario'} />
                <AvatarFallback className="rounded-lg">{nombres?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {!nombres || !email ? (
                  <>
                    <Skeleton className="w-10 h-2" />
                    <Skeleton className="w-24 h-2 mt-2" />
                  </>
                ) : (
                  <>
                    <span
                      className="truncate font-medium"
                    >{nombres}</span>
                    <span
                      className="truncate text-xs"
                    >{email}</span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={nombres || 'Avatar del usuario'} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{nombres}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'dark' ? (
                  <Moon />
                ) : (
                  <Sun />
                )}
                Cambiar tema
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem >
    </SidebarMenu >
  )
}
