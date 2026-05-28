import { create } from "zustand";

interface UserState {
  id: string | null;
  email: string | null;
  nombres: string | null;
  business_id: string | null;
  role: string | null
  setUser: (user: { id: string; email: string; nombres: string, role: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  email: null,
  nombres: null,
  business_id: null,
  role: null,

  setUser: (user) =>
    set({
      id: user.id,
      email: user.email,
      nombres: user.nombres,
      role: user.role
    }),

  clearUser: () =>
    set({
      id: null,
      email: null,
      nombres: null,
      role: null
    }),
}));
