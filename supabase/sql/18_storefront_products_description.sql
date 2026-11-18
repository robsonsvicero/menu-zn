-- Adiciona description à tabela storefront_products (máximo 160 caracteres)
ALTER TABLE public.storefront_products
  ADD COLUMN IF NOT EXISTS description text;
