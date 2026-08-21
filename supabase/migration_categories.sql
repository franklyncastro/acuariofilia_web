-- MIGRACION: agrega la tabla de categorias a un proyecto Supabase que ya tiene
-- la tabla "products" creada (del schema.sql original).
-- Ejecuta esto en Supabase -> SQL Editor -> New query -> Run

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

-- Cualquiera puede leer categorias (para el filtro de la pagina publica)
create policy "Categorias son publicas"
  on categories for select
  using (true);

-- Solo el admin logueado puede crear, editar o borrar categorias
create policy "Admin puede insertar categorias"
  on categories for insert
  to authenticated
  with check (true);

create policy "Admin puede editar categorias"
  on categories for update
  to authenticated
  using (true);

create policy "Admin puede borrar categorias"
  on categories for delete
  to authenticated
  using (true);

-- Categorias iniciales (las mismas que ya estaban fijas en el codigo)
insert into categories (slug, label, sort_order) values
  ('peces', 'Peces', 1),
  ('plantas', 'Plantas', 2),
  ('equipos', 'Equipos', 3),
  ('decoracion', 'Decoración', 4),
  ('alimentos', 'Alimentos', 5),
  ('otros', 'Otros', 6)
on conflict (slug) do nothing;
