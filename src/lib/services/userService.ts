import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function getUsers(businessId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at")
    .eq("business_id", businessId);

  if (error) throw error;

  return data;
}

export async function updateProfile(profileId: string, employe: { full_name: string; role: string }) {
  const { error } = await supabase
    .from('profiles')
    .update(employe)
    .eq("id", profileId)

  if (error) throw error;
}

export async function deleteProfile(profileId: string) {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);
    
  if (error) throw error;
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error;

  return data;
}