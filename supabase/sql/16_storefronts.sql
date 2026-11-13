create table if not exists public.storefronts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  banner_image_url text not null,
  banner_image_path text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.storefront_products (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.storefronts(id) on delete cascade,
  name text not null,
  image_url text not null,
  image_path text not null,
  price numeric(10, 2) not null check (price >= 0),
  link_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.storefront_products
  add column if not exists link_url text;

create index if not exists idx_storefront_products_storefront_order
  on public.storefront_products(storefront_id, sort_order, created_at);

alter table public.storefronts enable row level security;
alter table public.storefront_products enable row level security;

drop policy if exists storefronts_public_read on public.storefronts;
create policy storefronts_public_read on public.storefronts
for select using (is_active or public.can_edit_content());

drop policy if exists storefronts_edit on public.storefronts;
create policy storefronts_edit on public.storefronts
for all using (public.can_edit_content()) with check (public.can_edit_content());

drop policy if exists storefront_products_public_read on public.storefront_products;
create policy storefront_products_public_read on public.storefront_products
for select using (
  is_active and exists (
    select 1 from public.storefronts
    where storefronts.id = storefront_products.storefront_id
      and storefronts.is_active
  ) or public.can_edit_content()
);

drop policy if exists storefront_products_edit on public.storefront_products;
create policy storefront_products_edit on public.storefront_products
for all using (public.can_edit_content()) with check (public.can_edit_content());
