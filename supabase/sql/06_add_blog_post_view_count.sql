-- Adiciona contador público de visualizações para artigos do blog.

alter table public.blog_posts
  add column if not exists view_count integer not null default 0
  check (view_count >= 0);

create index if not exists idx_blog_posts_view_count
  on public.blog_posts(view_count desc);

create or replace function public.increment_blog_post_view(post_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_view_count integer;
begin
  update public.blog_posts
  set view_count = coalesce(view_count, 0) + 1
  where slug = post_slug
    and status = 'published'
  returning view_count into updated_view_count;

  return updated_view_count;
end;
$$;
