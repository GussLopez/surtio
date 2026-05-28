export interface Categorie {
  id: number;
  business_id: string;
  name: string;
  description: string | null;
  created_at: string
}

export interface CategorieForm {
  name: string;
  description: string | null;
  business_id: string
}