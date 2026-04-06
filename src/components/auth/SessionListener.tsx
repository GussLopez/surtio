'use client'

import { getProfileById } from "@/lib/services/userService";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

export default function SessionListener() {
  const supabase = getSupabaseBrowserClient();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const fetchProfile = async (id: string) => {
      const profile = await getProfileById(id);
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          nombres: profile.full_name || '',
          role: profile.memberships[0].role
        });
      }
    }

    const initSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user?.id) {
        await fetchProfile(data.user.id);
      }
    }
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (session?.user.id) {
          await fetchProfile(session.user.id);
        } else {
          clearUser();
        }
      });

    return () => subscription.unsubscribe();
  }, [])

  return null;
}
