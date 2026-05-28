export interface Product {
  barcode: string | null;
  business_id: string;
  category_id: number | null;
  cost: number;
  created_at: string | null;
  description: string | null;
  id: string;
  image: string | null;
  is_active: boolean;
  min_stock: number;
  model: string | null;
  name: string;
  price: number;
  sku: string;
  stock: number;
  supplier_id: number | null;
  unit: string | null;
  categories?: {
    id: number;
    name: string;
  } | null;
}

export type ProductForm = Omit<
  Product,
  "id" | "business_id" | "categories" | "created_at"
>;

export interface ProductItem extends Product {
  quantity?: number;
}
