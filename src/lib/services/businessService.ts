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

export async function createBusiness(business: BusinessForm) {
  const { data, error } = await supabase
    .from("businesses")
    .insert(business)
    .select()
    .single()

  if (error) throw error;

  return data;
}