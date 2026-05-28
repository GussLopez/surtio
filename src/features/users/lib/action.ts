"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface CreateEmployeProps {
  name: string;
  email: string;
  password: string;
  role: string;
  business_id: string;
}
export async function createEmploye({
  name,
  email,
  password,
  role,
  business_id,
}: CreateEmployeProps) {

  const { data, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (userError) throw userError;

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: name,
      email,
    });

  if (profileError) throw profileError;

  const { error: membershipError } = await supabase
    .from("memberships")
    .insert({
      user_id: userId,
      business_id,
      role,
    });

  if (membershipError) throw membershipError;

  return { success: true };
}

export async function deleteEmploye(userId: string) {
  const { error: membershipError } = await supabase
    .from("memberships")
    .delete()
    .eq("user_id", userId);

  if (membershipError) throw membershipError;

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) throw authError;

  return { success: true };
}
