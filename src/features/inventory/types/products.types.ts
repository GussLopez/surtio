import { Product } from "@/shared/types";

export type ProductForm = Omit<
  Product,
  "id" | "business_id" | "categories" | "created_at"
>;
