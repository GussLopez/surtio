import { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  businessId: string | null;
  loading: boolean;
};