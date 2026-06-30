-- MENU ZN - Supabase Schema (Passo 1)
-- Execute este arquivo primeiro no SQL Editor do Supabase.

create extension if not exists pgcrypto;

-- =============================================
-- Helpers
-- =============================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================
-- RBAC
-- =============================================
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);

-- =============================================
-- Catálogo base
-- =============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  zone text not null default 'zona-norte',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- =============================================
-- Estabelecimentos
-- =============================================
create table if not exists public.establishments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid not null references public.categories(id),
  neighborhood_id uuid references public.neighborhoods(id),
  short_description text,
  description text,
  address text,
  phone text,
  whatsapp text,
  website_url text,
  instagram_url text,
  image_cover_url text,
  has_ifood boolean not null default false,
  price_range text,
  average_ticket numeric(10,2),
  rating numeric(2,1),
  latitude numeric(10,7),
  longitude numeric(10,7),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_establishments_category on public.establishments(category_id);
create index if not exists idx_establishments_neighborhood on public.establishments(neighborhood_id);
create index if not exists idx_establishments_status on public.establishments(status);
create index if not exists idx_establishments_featured on public.establishments(is_featured);

create table if not exists public.establishment_tags (
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (establishment_id, tag_id)
);

-- =============================================
-- Blog
-- =============================================
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_md text,
  cover_image_url text,
  category_id uuid references public.blog_categories(id),
  author_id uuid references public.authors(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_category on public.blog_posts(category_id);

-- =============================================
-- Depoimentos
-- =============================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_avatar_url text,
  content text not null,
  rating integer check (rating between 1 and 5),
  source text,
  blog_post_id uuid references public.blog_posts(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean not null default false,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_testimonials_status on public.testimonials(status);
create index if not exists idx_testimonials_blog_post_id on public.testimonials(blog_post_id);

-- =============================================
-- Mídia e auditoria
-- =============================================
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(bucket, path)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.profiles(id),
  entity text not null,
  entity_id text not null,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- =============================================
-- Triggers de updated_at
-- =============================================
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_neighborhoods_updated_at on public.neighborhoods;
create trigger trg_neighborhoods_updated_at
before update on public.neighborhoods
for each row execute function public.set_updated_at();

drop trigger if exists trg_establishments_updated_at on public.establishments;
create trigger trg_establishments_updated_at
before update on public.establishments
for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_categories_updated_at on public.blog_categories;
create trigger trg_blog_categories_updated_at
before update on public.blog_categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();
