-- MENU ZN - Seed inicial (Passo 3)
-- Execute este arquivo apos 01_schema.sql e 02_rls.sql.
-- Ajuste o email do primeiro super admin antes de executar.

-- =============================================
-- Roles basicas
-- =============================================
insert into public.roles (code, name)
values
  ('super_admin', 'Super Admin'),
  ('admin', 'Admin'),
  ('editor', 'Editor'),
  ('viewer', 'Viewer')
on conflict (code) do nothing;

-- =============================================
-- Categorias iniciais
-- =============================================
insert into public.categories (name, slug, description)
values
  ('Restaurantes', 'restaurantes', 'Restaurantes da Zona Norte de Sao Paulo'),
  ('Pizzarias', 'pizzarias', 'Pizzarias recomendadas da Zona Norte'),
  ('Bares', 'bares', 'Bares e botecos da Zona Norte'),
  ('Padarias', 'padarias', 'Padarias e cafeterias da Zona Norte'),
  ('Hamburguerias', 'hamburguerias', 'Hamburguerias artesanais da Zona Norte'),
  ('Lanchonetes', 'lanchonetes', 'Lanches e hamburguerias da Zona Norte'),
  ('Orientais', 'orientais', 'Culinaria oriental na Zona Norte')
on conflict (slug) do nothing;

-- =============================================
-- Bairros iniciais
-- =============================================
insert into public.neighborhoods (name, slug)
values
  ('Santana', 'santana'),
  ('Mandaqui', 'mandaqui'),
  ('Tucuruvi', 'tucuruvi'),
  ('Vila Maria', 'vila-maria'),
  ('Casa Verde', 'casa-verde'),
  ('Freguesia do O', 'freguesia-do-o')
on conflict (slug) do nothing;

-- =============================================
-- Promocao do primeiro super admin
-- =============================================
-- 1) Crie o usuario pelo painel Auth do Supabase.
-- 2) Troque o email abaixo para o email real.

do $$
declare
  v_user_id uuid;
  v_role_id uuid;
  v_email text := 'admin@menuzn.com.br';
begin
  select id into v_user_id
  from auth.users
  where email = v_email
  limit 1;

  if v_user_id is null then
    raise notice 'Usuario % nao encontrado em auth.users. Crie o usuario antes.', v_email;
    return;
  end if;

  insert into public.profiles (id, full_name, is_active)
  values (v_user_id, 'Administrador Menu ZN', true)
  on conflict (id) do nothing;

  select id into v_role_id
  from public.roles
  where code = 'super_admin'
  limit 1;

  insert into public.user_roles (user_id, role_id)
  values (v_user_id, v_role_id)
  on conflict do nothing;

  raise notice 'Super admin configurado para %', v_email;
end $$;
