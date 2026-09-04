-- Ámbar & Cuerda — catalog schema, RLS and realtime
-- Run via: supabase db push  (or paste into the SQL editor of your project)

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  category text not null,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_path text, -- path inside the "product-photos" storage bucket
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_order_idx on public.products (sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Public (anon + authenticated) visitors may only SELECT published products.
-- Only signed-in admins (see admin_users below) may INSERT/UPDATE/DELETE.
-- This is what actually locks down the old demo's admin panel, which had
-- no access control at all.

alter table public.products enable row level security;

create policy "Published products are publicly readable"
  on public.products
  for select
  using (is_published = true);

-- Admin allow-list: every row here is a Supabase Auth user id allowed to
-- manage the catalog. Add admins with:
--   insert into public.admin_users (user_id) values ('<auth.users.id>');
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can see the allow-list"
  on public.admin_users
  for select
  using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create policy "Admins can read every product"
  on public.products
  for select
  using (public.is_admin());

create policy "Admins can insert products"
  on public.products
  for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete products"
  on public.products
  for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime: broadcast row changes so any open tab reflects stock instantly.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.products;

-- ---------------------------------------------------------------------------
-- Storage bucket for product photos (public read, admin write via RLS below)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "Product photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-photos');

create policy "Admins can upload product photos"
  on storage.objects for insert
  with check (bucket_id = 'product-photos' and public.is_admin());

create policy "Admins can update product photos"
  on storage.objects for update
  using (bucket_id = 'product-photos' and public.is_admin());

create policy "Admins can delete product photos"
  on storage.objects for delete
  using (bucket_id = 'product-photos' and public.is_admin());
