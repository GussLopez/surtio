import { getSupabaseBrowserClient } from "../supabase/browser-client";

export interface DashboardStats {
  ventas_hoy: number;
  productos_totales: number;
  productos_bajo_stock: number;
  ventas_canceladas: number;
  porcentaje_ventas: number;
}
const supabase = getSupabaseBrowserClient();

export const getKpis = async (businessId: string): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc("get_dashboard_stats", {
    p_business_id: businessId,
  });

  if (error) throw error;

  return data as unknown as DashboardStats;
};

export interface MonthlyData {
  ventas_totales_mes: number;
  ganancia_total_mes: number;
  porcentaje_comparativo: number;
  chart_data: {
    fecha: string;
    ventas_brutas: number;
    ganancia_neta: number;
  }[];
}

export const getMonthlyRevenue = async (
  businessId: string,
): Promise<MonthlyData> => {
  const { data, error } = await supabase.rpc("get_monthly_revenue_data", {
    p_business_id: businessId,
  });

  if (error) throw error;

  return data as unknown as MonthlyData;
};
