"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Store } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useUserStore } from "@/store/UserStore"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useBusinessStore } from "@/store/BusinessStore"
import { Skeleton } from "../../../components/ui/skeleton"
import Link from "next/link"
import { Business } from "@/types"

interface BusinessSoreProps {
  id: string;
  name: string;
  plan: string;
  owner_id: string;
}

interface BusinessData {
  role: string;
  businesses: Business;
}

export function BusinessSwitcher() {
  const userId = useUserStore((state) => state.id);
  const { isMobile } = useSidebar()
  const setBussines = useBusinessStore(state => state.setBusiness);
  const activeBusiness = useBusinessStore(state => state);
  const businessId = useBusinessStore(state => state.id);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<BusinessData[]>({
    queryKey: ["business", userId],
    queryFn: async () => {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 50,
    retry: 1
  })
  React.useEffect(() => {
    if (data?.length && !businessId) {
      const { businesses } = data[0];

      setBussines({
        id: businesses.id,
        name: businesses.name,
        owner_id: businesses.owner_id,
        plan: businesses.plan ?? "free"
      });

      document.cookie = `active_business_id=${businesses.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, [data, businessId, setBussines]);


  const handleChangeBusiness = (business: BusinessSoreProps) => {
    activeBusiness.clearBusiness();
    setBussines({
      id: business.id,
      name: business.name,
      plan: business.plan || 'free',
      owner_id: business.owner_id
    })

    document.cookie = `active_business_id=${business.id}; path=/; max-age=${60 * 60 * 24 * 7}`;

    queryClient.invalidateQueries()
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
              <div className="flex aspect-square size-8 p-1 items-center justify-center rounded-lg">
                <img
                  src="/img/logo/flyzzio-light.svg"
                  alt="Flyzzio Logo"
                  className="w-auto h-full hidden dark:block"
                />
                <img
                  src="/img/logo/flyzzio.svg"
                  alt="Flyzzio Logo"
                  className="w-auto h-full block dark:hidden"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {isLoading ? (
                  <>
                    <Skeleton className="w-25 h-3" />
                    <Skeleton className="w-14 h-2 mt-2" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-medium">{activeBusiness.name}</span>
                    <span
                      className={`truncate text-xs 
                        ${activeBusiness.plan === 'pro' && 'text-primary font-semibold'}
                        ${activeBusiness.plan === 'premium' && 'text-amber-400 font-semibold'}
                        
                      `}
                    >
                      {activeBusiness.plan === 'pro' && 'Pro'}
                      {activeBusiness.plan === 'free' && 'Gratuito'}
                      {activeBusiness.plan === 'premium' && 'Premium'}
                    </span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Tiendas
            </DropdownMenuLabel>
            {data?.map((business) => (
              <DropdownMenuItem
                key={business.businesses.id}
                onClick={() => handleChangeBusiness(business.businesses)}
                className={`gap-2 mb-1 p-2 ${business.businesses.id === businessId && 'bg-muted'}`}
              >
                <div className='flex size-6 items-center justify-center rounded-md border'>
                  <Store className='size-3.5 shrink-0' />
                </div>
                {business.businesses.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={'/admin/new'} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Agregar tienda</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
