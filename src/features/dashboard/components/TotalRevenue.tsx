'use client'

import { useBusinessStore } from "@/store/BusinessStore";
import ProfitBadge from "./ProfitBadge";
import { useQuery } from "@tanstack/react-query";
import { XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function TotalRevenue() {
  const businessId = useBusinessStore(state => state.id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyRevenue", businessId],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/month', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      })

      if (!res.ok) throw new Error('Error fetching');
      return res.json();
    },
    enabled: !!businessId,
    retry: 1
  })
  return (
    <div className="col-span-8 xl:h-68 xl:p-4 rounded-lg border border-muted shadow-xs">
      <div className="flex flex-col xl:flex-row xl:justify-between">
        <div className="flex flex-col grow p-4 xl:p-0">
          <p className="text-lg font-semibold">Ventas totales</p>
          <div className="mt-auto ">
            {isLoading ? (
              <Skeleton className="w-40 h-10" />
            ) : (
              <p className="text-4xl font-bold">$ {data?.ventas_totales_mes.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} <span className="text-lg font-medium">MXN</span>
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              {data?.porcentaje_comparativo && <ProfitBadge profit={data?.porcentaje_comparativo} />}
              <span className="text-xs text-muted-foreground">vs el anterior mes</span>
            </div>
          </div>
        </div>
        <div className="xl:w-[60%] h-60 rounded-md">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.chart_data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6900" stopOpacity={0.85} />
                    <stop offset="95%" stopColor="#ff6900" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                <XAxis
                  dataKey="fecha"
                  interval={4}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />

                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '14px',
                    borderColor: 'var(--input)',
                    color: 'var(--muted-foreground)',
                    fontWeight: 500,
                    backgroundColor: 'var(--background)'
                  }}
                  cursor={{ stroke: '#06B6D4', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                />

                <Area
                  type="linear"
                  dataKey="ventas_brutas"
                  stroke="#ff6900"
                  strokeWidth={3}
                  fill="url(#colorSales)"
                  fillOpacity={1}
                  activeDot={{ r: 6, stroke: '#00ABF5', fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
