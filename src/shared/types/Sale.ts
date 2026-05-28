export interface Sale {
  id: string;
  business_id: string;
  payment_method: string | null;
  sale_number: string | null;
  seller_name: string;
  total: number;
  user_id: string;
  created_at: string | null;
  sale_items: {
    id: string;
    price: number;
    product_id: string;
    quantity: number;
    products: {
      id: string;
      cost: number;
      name: string;
      sku: string;
    }
  }[];
}