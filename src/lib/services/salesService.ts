import { useCartStore } from "@/store/useCartStore";
import { getSupabaseBrowserClient } from "../supabase/browser-client";

const supabase = getSupabaseBrowserClient();

export async function createSaleFromCart(
  paymentMethod: "cash" | "card" | "transfer",
) {
  const items = useCartStore.getState().items;

  if (items.length === 0) {
    throw new Error("El carrito esta vacío");
  }

  const formattedItems = items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("create_sale", {
    p_payment_method: paymentMethod,
    p_items: formattedItems,
  });

  if (error) throw error;

  useCartStore.getState().clearCart();

  return data;
}

export async function getSales(dateRange?: { from?: Date; to?: Date }) {
  let query = supabase
    .from("sales")
    .select(
      `
      *,
      sale_items (
        id,
        quantity,
        price,
        product_id,
        products (
          id,
          name,
          sku,
          cost
        )
      )
    `,
    )
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(10);

  if (dateRange?.from) {
    query = query.gte("created_at", dateRange.from?.toISOString());
  }

  if (dateRange?.to) {
    const endOfDay = new Date(dateRange.to);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte("created_at", endOfDay.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

export async function getSaleById(saleId: string) {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `*,
      sale_items (
        id,
        quantity,
        price,
        product_id,
        products (
          id,
          name,
          sku,
          cost
        )
      )
        `,
    )
    .eq("id", saleId)
    .single();

  if (error) throw error;

  return data;
}

export async function DeleteSaleById(id: string) {
  const { error } = await supabase.from("sales").delete().eq("id", id);

  if (error) throw error;
}

export async function cancelSale(saleId: string, cancelReason: string) {
  const { error } = await supabase.rpc("cancel_sale", {
    p_sale_id: saleId,
    p_cancel_reason: cancelReason,
  });

  if (error) throw error;
}

export async function getSalesForExport(dateRange?: {
  from?: Date;
  to?: Date;
}) {
  let query = supabase
    .from("sales")
    .select(
      `
      *,
      sale_items (
        id,
        quantity,
        price,
        product_id,
        products (
          id,
          name,
          sku,
          cost
        )
      )
    `,
    )
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(10);

  if (dateRange?.from) {
    query = query.gte("created_at", dateRange.from?.toISOString());
  }

  if (dateRange?.to) {
    const endOfDay = new Date(dateRange.to);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte("created_at", endOfDay.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
