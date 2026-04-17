'use client'

import { useBusinessStore } from "@/store/BusinessStore";
import ProfitBadge from "./ProfitBadge";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyRevenue } from "@/lib/services/dashboardService";

export default function TotalRevenue() {
  const businessId = useBusinessStore(state => state.id);

  const { data, error } = useQuery({
    queryKey: ["monthlyRevenue", businessId],
    queryFn: () => getMonthlyRevenue(businessId!),
    enabled: !!businessId,
    retry: 1
  })

  console.log(data);
  return (
    <div className="col-span-8 h-68 p-4 rounded-lg border border-muted shadow-xs">
      <div className="flex justify-between ">
        <div className="flex flex-col grow">
          <p className="text-lg font-semibold">Ganancia Total</p>
          <div className="mt-auto ">
            <p className="text-4xl font-bold">$ {data?.ganancia_total_mes.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} <span className="text-lg font-medium">MXN</span></p>
            <div className="flex items-center gap-3 mt-2">
              {data?.porcentaje_comparativo && <ProfitBadge profit={data?.porcentaje_comparativo} />}
              <span className="text-xs text-muted-foreground">vs el anterior mes</span>
            </div>
          </div>
        </div>
        <div className="w-[60%] h-60 rounded-md bg-muted">

        </div>
      </div>
    </div>
  )
}
