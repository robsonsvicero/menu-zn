-- Migration to add gallery images support to establishments
alter table public.establishments add column if not exists images jsonb default '[]'::jsonb;
