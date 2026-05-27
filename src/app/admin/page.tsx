import DashboardKpis from "@/features/dashboard/components/DashboardKpis";
import MostSelledCategory from "@/features/dashboard/components/MostSelledCategory";
import MostSelledProduct from "@/features/dashboard/components/MostSelledProduct";
import TotalRevenue from "@/features/dashboard/components/TotalRevenue";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  return (
    <div>
      <DashboardKpis />
      <div className="xl:grid xl:grid-cols-12 gap-5 mt-6">
        <TotalRevenue />
        <div className="col-span-4 row-span-3">
          <MostSelledCategory />
        </div>
        <MostSelledProduct />
      </div>
    </div>
  )
}
