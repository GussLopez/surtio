export interface Supplier {
  address: string | null;
  business_id: string;
  contact_name: string | null;
  created_at: string;
  email: string | null;
  id: number;
  is_active: boolean;
  name: string;
  notes: string | null;
  phone: string | null;
}
export interface SupplierForm {
  business_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  address: string | null;
  notes: string | null;
}
