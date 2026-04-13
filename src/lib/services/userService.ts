import { UserForm } from "@/types";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function getUsers(businessId: string) {
  const { data, error } = await supabase
    .from("memberships")
    .select(
      `
      role,
      created_at,
      profiles:user_id (*)
    `
    )
    .eq("business_id", businessId)
    .order("created_at");
    
  if (error) throw error;

  return data;
}

export async function updateEmployee(
  profileId: string,
  businessId: string,
  data: { full_name: string; role: string }
) {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: data.full_name })
    .eq("id", profileId);

  if (profileError) throw profileError;

  const { error: membershipError } = await supabase
    .from("memberships")
    .update({ role: data.role })
    .eq("user_id", profileId)
    .eq("business_id", businessId);

  if (membershipError) throw membershipError;
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
    .select(`
        *,
        memberships (role)
      `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

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

async function waitForProfile(userId: string) {
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (data) return true;

    await new Promise((res) => setTimeout(res, 200));
  }

  throw new Error("Profile no se creó a tiempo");
}

export async function updateProfile (data: UserForm, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId)
  
  if (error) throw error;
}
