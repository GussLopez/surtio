'use client'

import { useBusinessStore } from "@/store/BusinessStore";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Bar, BarChart, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export interface CategoryData {
  categoria: string;
  unidades: number;
  porcentaje: number;
}

export interface TopCategoriesResponse {
  total_units: number;
  period: 'week' | 'month' | 'year';
  categories: CategoryData[];
}

const COLORS = [
  "#ea580c",
  "#f43f5e",
  "#c026d3",
  "#4f46e5",
  "#0891b2",
];

export default function TopCategoriesChart() {
  const businessId = useBusinessStore(state => state.id);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const { data, isLoading } = useQuery<TopCategoriesResponse>({
    queryKey: ["topCategories", businessId, period],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/top/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, period })
      });
      if (!res.ok) throw new Error('Error fetching');
      return res.json();
    },
    enabled: !!businessId,
    retry: 1
  });

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      unidades: { label: "Unidades" }
    };
    data?.categories?.forEach((cat, index) => {
      config[cat.categoria] = {
        label: cat.categoria,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [data?.categories]);

  const chartData = useMemo(() => {
    return data?.categories?.map((cat, index) => ({
      name: cat.categoria,
      unidades: cat.unidades,
      porcentaje: cat.porcentaje,
      fill: COLORS[index % COLORS.length],
    })) || [];
  }, [data?.categories]);

  return (
    <div className="flex flex-col p-4 rounded-lg border border-muted shadow-xs">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-lg font-semibold">Categorías de Ventas</p>
          <p className="text-xs text-muted-foreground">Categorías de productos más vendidos</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month' | 'year')}>
          <SelectTrigger size="sm" className="w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semanal</SelectItem>
            <SelectItem value="month">Mensual</SelectItem>
            <SelectItem value="year">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-62.5 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62.5 w-full mt-4">
          <BarChart
            width={400}
            height={250}
            data={chartData}
            layout="vertical"
          >
            <Bar
              dataKey="unidades"
              radius={5}
              barSize={30}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
            />

            <XAxis type="number" hide />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />

          </BarChart>
        </ChartContainer>
      )}

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-full h-3" />
          </>
        ) : (
          data?.categories?.map((cat, index) => (
            <div key={cat.categoria} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">
                {cat.categoria} ({cat.porcentaje}%)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
