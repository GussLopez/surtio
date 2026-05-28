import { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  businessId: string | null;
  loading: boolean;
};

export type SingUpInput = {
  name: string;
  email: string;
  password: string;
}

export type SignInInput = Pick<SingUpInput, 'email' | 'password'>