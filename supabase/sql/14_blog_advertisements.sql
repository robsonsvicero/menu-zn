create table if not exists public.blog_advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  image_path text not null,
  target_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_advertisements_active_created
  on public.blog_advertisements(is_active, created_at);

alter table public.blog_advertisements enable row level security;

drop policy if exists blog_advertisements_public_read on public.blog_advertisements;
create policy blog_advertisements_public_read on public.blog_advertisements
for select
using (is_active or public.can_edit_content());

drop policy if exists blog_advertisements_edit on public.blog_advertisements;
create policy blog_advertisements_edit on public.blog_advertisements
for all
using (public.can_edit_content())
with check (public.can_edit_content());
