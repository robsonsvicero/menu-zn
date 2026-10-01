alter table public.blog_posts
  add column if not exists tags text[] not null default '{}';