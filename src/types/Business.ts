export interface BusinessForm {
  name: string;
  plan: string;
  description: string;
  legal_name: string;
  rfc: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
  owner_id: string;
}

export interface Business {
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string | null;
  currency: string;
  description: string | null;
  email: string | null;
  id: string;
  legal_name: string | null;
  logo: string | null;
  name: string;
  owner_id: string;
  phone: string | null;
  plan: string;
  rfc: string | null;
  state: string | null;
  timezone: string;
  zip_code: string | null;
}
