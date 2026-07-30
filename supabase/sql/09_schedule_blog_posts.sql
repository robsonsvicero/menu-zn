-- MENU ZN - Agendamento de artigos do blog
-- Execute após 08_add_author_instagram_url.sql.
-- Um artigo com status "published" e published_at no futuro fica agendado.
-- A publicação ocorre automaticamente quando o horário chega, sem cron adicional.

create index if not exists idx_blog_posts_publication_schedule
  on public.blog_posts(status, published_at);

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
for select
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);
