-- Optional: seed data matching the original demo catalog, for local dev only.
-- Upload the matching photos to the "product-photos" bucket with these paths
-- first, or leave image_path null to fall back to the placeholder art direction.

insert into public.products (sku, category, name, description, price_cents, stock, image_path, sort_order)
values
  ('AC-033', 'Anillo', 'Cauce', 'Banda de latón martillado a mano, acabado mate envejecido.', 1800, 4, 'seed/cauce.jpg', 1),
  ('AC-021', 'Pendientes', 'Marea', 'Aro fino de latón con piedra de cuarzo ahumado, par único.', 2400, 0, 'seed/marea.jpg', 2),
  ('AC-026', 'Pendientes', 'Cala', 'Colgantes largos de latón con piedra de jaspe rojo.', 2600, 2, 'seed/cala.jpg', 3),
  ('AC-017', 'Collar', 'Raíz', 'Cadena fina de latón con nudo central de cordón natural.', 2100, 5, 'seed/raiz.jpg', 4),
  ('AC-009', 'Pulsera', 'Nudo Simple', 'Trenzado de cordón encerado en dos tonos, cierre de latón ajustable.', 2400, 3, 'seed/nudo.jpg', 5)
on conflict (sku) do nothing;
