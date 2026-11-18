-- Adiciona whatsapp_number à tabela storefronts (nullable, formato DDD+número sem máscara)
ALTER TABLE storefronts
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
