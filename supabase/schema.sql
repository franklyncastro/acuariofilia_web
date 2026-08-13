-- Ejecuta este script en Supabase: Dashboard -> SQL Editor -> New query -> Run

-- 1) Tabla de productos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null,
  category text not null default 'otros',
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2) Seguridad a nivel de fila (RLS)
alter table products enable row level security;

-- Cualquiera puede LEER productos activos (para la pagina publica)
create policy "Productos activos son publicos"
  on products for select
  using (active = true);

-- Solo usuarios autenticados (el admin) pueden ver TODOS los productos,
-- incluidos los inactivos
create policy "Admin puede ver todo"
  on products for select
  to authenticated
  using (true);

-- Solo usuarios autenticados pueden insertar, editar o borrar
create policy "Admin puede insertar"
  on products for insert
  to authenticated
  with check (true);

create policy "Admin puede editar"
  on products for update
  to authenticated
  using (true);

create policy "Admin puede borrar"
  on products for delete
  to authenticated
  using (true);

-- 3) Bucket de almacenamiento para las fotos de productos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Fotos de productos son publicas"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin puede subir fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Admin puede borrar fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- 4) Datos de ejemplo (opcional, puedes borrarlos desde el admin)
insert into products (name, price, category, sort_order) values
  ('Betta macho premium', 850, 'peces', 1),
  ('Guppy fancy (par)', 450, 'peces', 2),
  ('Anubias nana en roca', 650, 'plantas', 3),
  ('Filtro interno 400L/h', 1950, 'equipos', 4);
