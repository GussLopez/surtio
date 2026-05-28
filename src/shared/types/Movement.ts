export interface Movement {
  batch_id: string | null;
  business_id: string;
  created_at: string;
  id: number;
  product_id: string;
  quantity: number;
  reference: string | null;
  supplier_id: number | null;
  type: string;
  user_id: string | null;
  profiles: {
    id: string;
    full_name: string | null;
  } | null;
  products: {
    name: string;
    sku: string;
  };
}
