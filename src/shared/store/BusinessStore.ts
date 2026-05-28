import { create } from "zustand";

interface BusinessState {
  id: string | null;
  name: string | null;
  owner_id: string | null;
  plan: string | null;
  setBusiness: (business: {
    id: string;
    name: string;
    owner_id: string;
    plan: string;
  }) => void;
  setName: (name: string) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  id: null,
  name: null,
  owner_id: null,
  plan: null,

  setBusiness: (data) => set((state) => ({ ...state, ...data })),
  setName: (name: string) => set(() => ({ name })),
  clearBusiness: () =>
    set({
      id: null,
      name: null,
      owner_id: null,
      plan: null,
    }),
}));
