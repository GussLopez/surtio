import { UserForm } from "@/types";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();


export async function getMyRole(businessId: string) {
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("memberships")
    .select("role")
    .eq("business_id", businessId)
    .eq("user_id", user.data.user?.id!)
    .single();

  if (error) throw error;

  return data.role;
}
