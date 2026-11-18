-- Adiciona shipping_fee à tabela storefront_products
ALTER TABLE public.storefront_products
  ADD COLUMN IF NOT EXISTS shipping_fee numeric(10, 2);
