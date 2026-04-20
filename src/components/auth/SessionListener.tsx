'use client'

import { getProfileById } from "@/lib/services/userService";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

export default function SessionListener() {
  const supabase = getSupabaseBrowserClient();

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const setToken = useAuthStore((state) => state.setToken);

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
    };

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (session?.access_token) {
        setToken(session.access_token);
      } else {
        setToken(null);
      }

      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {

      if (session?.access_token) {
        setToken(session.access_token);
      } else {
        setToken(null);
      }

      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}