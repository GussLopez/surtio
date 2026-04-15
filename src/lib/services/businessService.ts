import { Business, BusinessForm } from "@/types";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function getBusinessByUserId(userId: string) {
  const { data, error } = await supabase
    .from("memberships")
    .select(
      `
      role,
      businesses (*)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}

export async function createBusiness(bData: BusinessForm) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuario no autenticado");

  const payload = {
    ...bData,
  };
  const { data: businessId, error: rpcError } = await supabase.rpc(
    "create_business_with_membership",
    { business_data: payload },
  );

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

export async function getBusinessById(id: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function editBusiness(businessId: string, business: BusinessForm) {
  const { error } = await supabase
    .from("businesses")
    .update(business)
    .eq("id", businessId);

  if (error) throw error;
}

export async function DeleteBusiness(businessId: string) {
  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", businessId);

  if (error) throw error;
}
