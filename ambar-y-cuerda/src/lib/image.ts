/**
 * Responsive image URLs for photos stored in Supabase Storage.
 *
 * Supabase's Storage CDN can transform images on the fly via its
 * `/render/image/public/...` endpoint (width, quality, format), so we build
 * a real srcset instead of shipping one fixed-size file to every device.
 * This runs at request/build time (URL construction only, zero client cost)
 * and the resizing itself happens on Supabase's edge, not in the browser.
 *
 * Requires the Storage image transformation add-on to be enabled on the
 * Supabase project (Pro plan or higher). If it's off, these URLs still
 * resolve — Supabase serves the original file and ignores the params — so
 * nothing breaks, you just don't get the smaller variants yet.
 */

const WIDTHS = [480, 768, 1080, 1440, 2160] as const;

export function productImageUrl(
  supabaseUrl: string,
  imagePath: string,
  opts: { width?: number; quality?: number } = {}
): string {
  const { width, quality = 72 } = opts;
  const base = `${supabaseUrl}/storage/v1/render/image/public/product-photos/${imagePath}`;
  const params = new URLSearchParams({ quality: String(quality), resize: "cover" });
  if (width) params.set("width", String(width));
  return `${base}?${params.toString()}`;
}

export function productImageSrcSet(supabaseUrl: string, imagePath: string): string {
  return WIDTHS.map((w) => `${productImageUrl(supabaseUrl, imagePath, { width: w })} ${w}w`).join(
    ", "
  );
}

export const RECOMMENDED_SIZES =
  "(max-width: 767px) 100vw, (max-width: 1279px) 60vw, 50vw";
