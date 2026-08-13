-- MENU ZN - Ajuste de schema (Passo 12)
-- Adiciona a flag de plano para controlar a exibição do mapa do restaurante.

alter table if exists public.establishments
  add column if not exists has_plan boolean not null default false;

create index if not exists idx_establishments_plan
  on public.establishments(has_plan);
