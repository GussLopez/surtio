import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export interface MovementInsert {
  product_id: string;
  business_id: string;
  quantity: number;
  type: "entrada" | "salida" | "ajuste";
  user_id?: string | null;
  supplier_id?: number | null;
  reference?: string | null;
  batch_id: string;
}

export async function createMovement(movements: MovementInsert[]) {
  const { error } = await supabase
    .from("inventory_movements")
    .insert(movements);

  if (error) throw error;

  return { success: true };
}

export async function getMovements(
  businessId: string,
  userId?: string,
  dateRange?: { from?: Date; to?: Date },
) {
  let query = supabase.from("inventory_movements").select(`
      *,
      profiles (
        id,
        full_name
      ),
      products (
        name,
        sku
      )
    `).eq("business_id", businessId)
  if (userId && userId !== "ninguno") {
    query = query.eq("user_id", userId);
  }

  if (dateRange?.from) {
    query = query.gte("created_at", dateRange.from.toISOString());
  }

  if (dateRange?.to) {
    const endOfDay = new Date(dateRange.to)
    endOfDay.setHours(23, 59, 59, 999);

    query = query.lte("created_at", endOfDay.toISOString());
  }
  const { data, error } = await query;

  if (error) throw error;

  return data;
}

export async function deleteMovement(movementId: number) {
  const { error } = await supabase
    .from("inventory_movements")
    .delete()
    .eq("id", movementId);

  if (error) throw error;
}
