import { BusinessForm } from "@/types";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function getBusinessByUserId(id: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", id);

  if (error) throw error;

  return data;
}

export async function createBusiness(name: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuario no autenticado");

  const { data: businessId, error: rpcError } = await supabase
    .rpc('create_business_with_membership', { business_name: name });

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    throw new Error(`Error al crear negocio: ${rpcError.message}`);
  }

  const { data: business, error: fetchError } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (fetchError) {
    throw new Error(`Error al obtener negocio: ${fetchError.message}`);
  }

  return business;
}