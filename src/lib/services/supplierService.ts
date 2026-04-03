import { SupplierForm } from "@/types";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function createSupplier(supplier: SupplierForm) {
  const { data, error } = await supabase
  .from("suppliers")
  .insert(supplier)
  .select()
  .single()

  if (error) throw error;

  return data;
}

export async function getBusinessSuppliers(businessId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("business_id", businessId);

  if (error) throw error;

  return data;
}

export async function updateSupplier(
  supplierId: number,
  supplier: SupplierForm,
) {
  const { error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", supplierId);

  if (error) throw error;
}

export async function deleteSupplier(supplierId: number) {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", supplierId);

  if (error) throw error;
}
