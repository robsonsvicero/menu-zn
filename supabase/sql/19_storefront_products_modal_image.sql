-- Adiciona modal_image_url e modal_image_path à tabela storefront_products
ALTER TABLE public.storefront_products
  ADD COLUMN IF NOT EXISTS modal_image_url text,
  ADD COLUMN IF NOT EXISTS modal_image_path text;
