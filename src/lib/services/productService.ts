import { getSupabaseBrowserClient } from "../supabase/browser-client";

export async function searchProducts(query: string, businessId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
    .order("name", { ascending: true })
    .limit(10)
    .eq("business_id", businessId);
  if (error) throw error;

  return data;
}
