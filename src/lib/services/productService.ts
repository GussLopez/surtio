import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function getProducts(businessId: string, categoryId?: number, search?: string) {
  let query = supabase.from("products").select(
    `
    *,
    categories (
      id,
      name
    )  
  `,
  ).eq('business_id', businessId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (search && search.trim() !== "") {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;

  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createProduct(product: any, businessId: string) {
  const { error } = await supabase.from("products").insert({
    ...product,
    business_id: businessId
  });
  console.log('ERROR: ', error);
  if (error) throw error;
}

export async function updateProduct(id: string, product: any) {
  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
}

export async function searchProducts(query: string, businessId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
    .order("name", { ascending: true })
    .limit(10)
    .eq('business_id', businessId);
  if (error) throw error;

  return data;
}
