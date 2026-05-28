'use client'

import { ArrowDownNarrowWide, Ban, DollarSign, Package } from "lucide-react";
import ProfitBadge from "./ProfitBadge";
import { useQuery } from "@tanstack/react-query";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface DashboardStats {
  ventas_hoy: number;
  productos_totales: number;
  productos_bajo_stock: number;
  ventas_canceladas: number;
  porcentaje_ventas: number;
}

export default function DashboardKpis() {
  const businessId = useBusinessStore(state => state.id);
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboardKpis", businessId],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/kpis', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      });
      
      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    enabled: !!businessId,
    retry: 1
  })

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
      <div className="p-5 shadow-xs rounded-lg border border-muted">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">Ventas de Hoy</p>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 items-end">
            {isLoading
              ? <Skeleton className="w-24 h-4" />
              : <p className="text-3xl font-bold">$ {data?.ventas_hoy.toFixed(2)}</p>
            }
            {data && (
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <ProfitBadge profit={data.porcentaje_ventas} />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>En comparación con las ventas de ayer</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 shadow-xs rounded-lg border border-muted">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">Productos Totales</p>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Package size={20} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 items-end">
            {isLoading
              ? <Skeleton className="w-24 h-4" />
              : <p className="text-3xl font-bold">{data?.productos_totales}</p>
            }
          </div>
        </div>
      </div>

      <div className="p-5 shadow-xs rounded-lg border border-muted">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">Productos bajo Stock</p>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <ArrowDownNarrowWide size={20} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 items-end">
            {isLoading
              ? <Skeleton className="w-24 h-4" />
              : <p className="text-3xl font-bold">{data?.productos_bajo_stock}</p>
            }
          </div>
        </div>
      </div>
      <div className="p-5 shadow-xs rounded-lg border border-muted">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">Ventas canceladas</p>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Ban size={20} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 items-end">
            {isLoading
              ? <Skeleton className="w-24 h-4"/>
              : <p className="text-3xl font-bold">{data?.ventas_canceladas}</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
