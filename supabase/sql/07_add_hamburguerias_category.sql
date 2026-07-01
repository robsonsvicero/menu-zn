-- Adiciona a categoria Hamburguerias para cadastro e listagem publica.

insert into public.categories (name, slug, description)
values ('Hamburguerias', 'hamburguerias', 'Hamburguerias artesanais da Zona Norte')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true;
