import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Browser/anon Supabase client. Safe to use in client-side <script> islands
 * and in prerendered pages at build time (read-only, RLS-gated).
 */
export function getSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

export function publicPhotoUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  if (!url) return null;
  return `${url}/storage/v1/object/public/product-photos/${imagePath}`;
}
