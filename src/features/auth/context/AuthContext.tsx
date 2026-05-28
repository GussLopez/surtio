'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/shared/supabase/browser-client";
import { AuthContextType } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {

    const loadUserData = async () => {
      setLoading(true);

      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;

      setUser(currentUser);

      if (!currentUser) {
        setBusinessId(null);
        setLoading(false);
        return;
      }

      const { data: memberships } = await supabase
        .from("memberships")
        .select("business_id, role")
        .eq("user_id", currentUser.id);

      if (!memberships || memberships.length === 0) {
        setBusinessId(null);
        setLoading(false);
        return;
      }

      setBusinessId(memberships[0].business_id);
      setLoading(false);
    };
    loadUserData();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setBusinessId(null);
        return;
      }

      const loadUserData = async () => {
        const { data } = await supabase.auth.getUser();
        const currentUser = data.user;

        setUser(currentUser);

        if (!currentUser) {
          setBusinessId(null);
          return;
        }

        const { data: memberships } = await supabase
          .from("memberships")
          .select("business_id, role")
          .eq("user_id", currentUser.id);

        if (!memberships || memberships.length === 0) {
          setBusinessId(null);
          return;
        }

        setBusinessId(memberships[0].business_id);
      };
    });
    loadUserData();

    return () => {
      subscription.unsubscribe();
    }

  }, []);

  return (
    <AuthContext.Provider value={{ user, businessId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUserAuth must be used within AuthContextProvider");
  }

  return context;
};
