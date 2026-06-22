# Supabase Setup - MENU ZN

Este guia define a ordem de execucao para habilitar banco de dados real, auth e controle de acesso.

## 1. Ordem de execucao SQL

1. Execute [supabase/sql/01_schema.sql](../supabase/sql/01_schema.sql)
2. Execute [supabase/sql/02_rls.sql](../supabase/sql/02_rls.sql)
3. Execute [supabase/sql/03_seed.sql](../supabase/sql/03_seed.sql)

## 2. Variaveis de ambiente (Next.js)

Adicione no arquivo .env.local:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=media-public

Observacao:
- SUPABASE_SERVICE_ROLE_KEY deve ser usada somente no servidor.
- Nunca exponha a service role no cliente.

## 3. Buckets sugeridos (Supabase Storage)

1. media-public (logos, imagens publicas)
2. media-admin (arquivos de painel)

Politicas:
1. Leitura publica para media-public.
2. Upload/edicao apenas para editor, admin, super_admin.

## 4. Fluxo minimo de autenticacao

1. Usuario faz login com email e senha (Supabase Auth).
2. App consulta profile e user_roles.
3. Middleware protege rotas /admin.
4. UI habilita modulos conforme role.

## 5. Entregas sugeridas por sprint

Sprint 1:
1. Auth + profiles + roles + user_roles.
2. CRUD de establishments com status draft/published.

Sprint 2:
1. CRUD blog_posts + testimonials.
2. Upload de media_assets e ligacao com conteudo.

Sprint 3:
1. Gestao de usuarios no admin.
2. Auditoria e hardening de seguranca.

## 6. Proximo passo de implementacao no app

1. Instalar cliente Supabase no projeto.
2. Criar helper server/client para Supabase.
3. Criar middleware para proteger /admin.
4. Criar primeira tela admin: login e dashboard basico.
