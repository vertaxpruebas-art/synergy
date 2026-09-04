import { getSupabaseClient, publicPhotoUrl } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export interface CatalogProduct extends Product {
  imageUrl: string | null;
}

/**
 * Reads the published catalog. Used at build time (prerendered index page)
 * and by the client-side reel script for its initial paint before the
 * realtime subscription takes over.
 */
export async function fetchPublishedProducts(): Promise<CatalogProduct[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[products] failed to fetch catalog:", error.message);
    return [];
  }

  return (data as Product[]).map((p) => ({ ...p, imageUrl: publicPhotoUrl(p.image_path) }));
}

export function formatPriceEUR(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}
