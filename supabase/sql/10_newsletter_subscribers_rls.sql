-- MENU ZN - RLS para newsletter_subscribers
-- Execute apos create_newsletter_subscribers.sql e 02_rls.sql

alter table public.newsletter_subscribers enable row level security;

-- Permite cadastro publico via formulario do site
drop policy if exists newsletter_subscribers_insert_public on public.newsletter_subscribers;
create policy newsletter_subscribers_insert_public on public.newsletter_subscribers
for insert
with check (true);

-- Permite leitura apenas para usuarios com permissao de edicao no admin
drop policy if exists newsletter_subscribers_select_admin on public.newsletter_subscribers;
create policy newsletter_subscribers_select_admin on public.newsletter_subscribers
for select
using (public.can_edit_content());

-- Permite remocao apenas para usuarios com permissao de edicao no admin
drop policy if exists newsletter_subscribers_delete_admin on public.newsletter_subscribers;
create policy newsletter_subscribers_delete_admin on public.newsletter_subscribers
for delete
using (public.can_edit_content());
