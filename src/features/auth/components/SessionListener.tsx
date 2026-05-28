'use client'

import { getSupabaseBrowserClient } from "@/shared/supabase/browser-client";
import { useAuthStore } from "@/shared/store/AuthStore";
import { useUserStore } from "@/shared/store/UserStore";
import { useEffect } from "react";

export default function SessionListener() {
  const supabase = getSupabaseBrowserClient();

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const fetchProfile = async (id: string) => {
      const res = await fetch(`/api/users/profile/${id}`, {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Error fetching');

      const profile = await res.json();

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