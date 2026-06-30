-- MENU ZN - Vinculo de depoimentos com artigos do blog
-- Execute este arquivo em projetos que ja rodaram o schema inicial.

alter table public.testimonials
  add column if not exists blog_post_id uuid references public.blog_posts(id) on delete set null;

create index if not exists idx_testimonials_blog_post_id
  on public.testimonials(blog_post_id);
