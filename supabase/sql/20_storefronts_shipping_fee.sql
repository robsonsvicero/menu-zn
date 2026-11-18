-- Adiciona shipping_fee à tabela storefronts (frete por pedido da vitrine)
ALTER TABLE public.storefronts
  ADD COLUMN IF NOT EXISTS shipping_fee numeric(10, 2);
