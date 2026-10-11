alter table public.blog_advertisements
  add column if not exists click_count integer not null default 0
  check (click_count >= 0);

create or replace function public.increment_blog_advertisement_click(advertisement_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_click_count integer;
begin
  update public.blog_advertisements
  set click_count = click_count + 1
  where id = advertisement_id
    and is_active = true
  returning click_count into updated_click_count;

  return updated_click_count;
end;
$$;

revoke all on function public.increment_blog_advertisement_click(uuid)
  from public, anon, authenticated;
grant execute on function public.increment_blog_advertisement_click(uuid)
  to service_role;
