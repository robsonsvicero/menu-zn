-- MENU ZN - Ajuste de schema (Passo 4)
-- Adiciona coluna de indicacoes para estabelecimentos.
-- Execute este arquivo no SQL Editor do Supabase (producao e desenvolvimento).

alter table if exists public.establishments
  add column if not exists is_indicated boolean not null default false;

create index if not exists idx_establishments_indicated
  on public.establishments(is_indicated);
