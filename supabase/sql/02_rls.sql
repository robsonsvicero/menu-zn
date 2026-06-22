-- MENU ZN - Supabase RLS (Passo 2)
-- Execute este arquivo apos o 01_schema.sql.

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.tags enable row level security;
alter table public.establishments enable row level security;
alter table public.establishment_tags enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.media_assets enable row level security;
alter table public.audit_logs enable row level security;

-- =============================================
-- Helpers de autorizacao
-- =============================================
create or replace function public.has_role(role_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.code = role_code
  );
$$;

create or replace function public.is_admin_or_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin') or public.has_role('super_admin');
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('editor') or public.is_admin_or_super_admin();
$$;

-- =============================================
-- Roles e user_roles
-- =============================================
drop policy if exists roles_select_admin on public.roles;
create policy roles_select_admin on public.roles
for select
using (public.is_admin_or_super_admin());

drop policy if exists roles_mutation_super_admin on public.roles;
create policy roles_mutation_super_admin on public.roles
for all
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

drop policy if exists user_roles_select_admin on public.user_roles;
create policy user_roles_select_admin on public.user_roles
for select
using (public.is_admin_or_super_admin() or user_id = auth.uid());

drop policy if exists user_roles_mutation_admin on public.user_roles;
create policy user_roles_mutation_admin on public.user_roles
for all
using (public.is_admin_or_super_admin())
with check (public.is_admin_or_super_admin());

-- =============================================
-- Profiles
-- =============================================
drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles
for select
using (id = auth.uid() or public.is_admin_or_super_admin());

drop policy if exists profiles_insert_self_or_admin on public.profiles;
create policy profiles_insert_self_or_admin on public.profiles
for insert
with check (id = auth.uid() or public.is_admin_or_super_admin());

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles
for update
using (id = auth.uid() or public.is_admin_or_super_admin())
with check (id = auth.uid() or public.is_admin_or_super_admin());

-- =============================================
-- Catálogo publico + admin
-- =============================================
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
for select
using (is_active = true);

drop policy if exists categories_edit on public.categories;
create policy categories_edit on public.categories
for all
using (public.can_edit_content())
with check (public.can_edit_content());

drop policy if exists neighborhoods_public_read on public.neighborhoods;
create policy neighborhoods_public_read on public.neighborhoods
for select
using (is_active = true);

drop policy if exists neighborhoods_edit on public.neighborhoods;
create policy neighborhoods_edit on public.neighborhoods
for all
using (public.can_edit_content())
with check (public.can_edit_content());

drop policy if exists tags_public_read on public.tags;
create policy tags_public_read on public.tags
for select
using (true);

drop policy if exists tags_edit on public.tags;
create policy tags_edit on public.tags
for all
using (public.can_edit_content())
with check (public.can_edit_content());

-- =============================================
-- Estabelecimentos
-- =============================================
drop policy if exists establishments_public_read on public.establishments;
create policy establishments_public_read on public.establishments
for select
using (status = 'published');

drop policy if exists establishments_edit on public.establishments;
create policy establishments_edit on public.establishments
for all
using (public.can_edit_content())
with check (public.can_edit_content());

drop policy if exists establishment_tags_public_read on public.establishment_tags;
create policy establishment_tags_public_read on public.establishment_tags
for select
using (true);

drop policy if exists establishment_tags_edit on public.establishment_tags;
create policy establishment_tags_edit on public.establishment_tags
for all
using (public.can_edit_content())
with check (public.can_edit_content());

-- =============================================
-- Blog
-- =============================================
drop policy if exists blog_categories_public_read on public.blog_categories;
create policy blog_categories_public_read on public.blog_categories
for select
using (true);

drop policy if exists blog_categories_edit on public.blog_categories;
create policy blog_categories_edit on public.blog_categories
for all
using (public.can_edit_content())
with check (public.can_edit_content());

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
for select
using (status = 'published');

drop policy if exists blog_posts_edit on public.blog_posts;
create policy blog_posts_edit on public.blog_posts
for all
using (public.can_edit_content())
with check (public.can_edit_content());

-- =============================================
-- Depoimentos
-- =============================================
drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
for select
using (status = 'approved');

drop policy if exists testimonials_edit on public.testimonials;
create policy testimonials_edit on public.testimonials
for all
using (public.can_edit_content())
with check (public.can_edit_content());

-- =============================================
-- Midia e auditoria
-- =============================================
drop policy if exists media_assets_select_editor on public.media_assets;
create policy media_assets_select_editor on public.media_assets
for select
using (public.can_edit_content());

drop policy if exists media_assets_edit_editor on public.media_assets;
create policy media_assets_edit_editor on public.media_assets
for all
using (public.can_edit_content())
with check (public.can_edit_content());

drop policy if exists audit_logs_select_admin on public.audit_logs;
create policy audit_logs_select_admin on public.audit_logs
for select
using (public.is_admin_or_super_admin());

-- Insercao em audit_logs deve ser feita preferencialmente por service_role.
