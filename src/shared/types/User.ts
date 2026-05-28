export interface Employe {
  name: string;
  email: string;
  password: string;
  role: string;
  business_id: string;
}

export interface Profile {
  avatar_url: string | null;
  created_at: string | null;
  email: string;
  full_name: string | null;
  id: string;
  is_active: boolean;
  is_blocked: boolean | null;
  last_login_at: string | null;
  last_name: string | null;
  phone: string | null;
  memberships: {
    role: string;
  }[];
}

export interface UserForm {
  avatar_url: string | null;
  full_name: string | null;
  last_name: string | null;
  phone: string | null;
  memberships: {
    role: string;
  }[];
}
