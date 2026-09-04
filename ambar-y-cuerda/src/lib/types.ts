export interface Product {
  id: string;
  sku: string;
  category: string;
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  image_path: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Pick<
  Product,
  "sku" | "category" | "name" | "description" | "price_cents" | "stock" | "sort_order"
> & { image_path?: string | null };
