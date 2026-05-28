import { getSupabaseBrowserClient } from "@/shared/supabase/browser-client";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  setToken: (token) => set({ token }),

  signOut: async () => {
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("Ocurrió un error durante el cierre de sesión");
    }

    set({ token: null });
  },
}));