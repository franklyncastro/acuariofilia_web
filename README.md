# Acuariofilia Punta Cana

Sitio de una tienda física de acuarismo: catálogo público con pedidos por WhatsApp
y un panel de administración (`/admin`) para agregar, editar, ocultar y eliminar productos.

- Público: `/`
- Admin: `/admin` (pide iniciar sesión en `/admin/login`)

## Stack

- React + Vite
- Supabase (base de datos de productos, fotos y login del admin)
- React Router
- CSS plano (sin librerías de UI)

## 1. Crear el proyecto en Supabase

1. Ve a https://supabase.com y crea un proyecto nuevo (gratis).
2. En el proyecto, abre **SQL Editor** → **New query**, pega el contenido de
   `supabase/schema.sql` y presiona **Run**. Esto crea:
   - la tabla `products`
   - las reglas de seguridad (solo el admin logueado puede crear/editar/borrar)
   - el bucket de almacenamiento `product-images` para las fotos
   - 4 productos de ejemplo
3. Ve a **Authentication → Users → Add user** y crea tu usuario admin
   (correo + contraseña). Ese correo y contraseña son con los que vas a
   entrar a `/admin/login`.
4. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public` key

## 2. Configurar el proyecto localmente

```bash
npm install
cp .env.example .env
```

Abre `.env` y pega los valores de Supabase que copiaste, más tu número de WhatsApp:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
VITE_WHATSAPP_NUMBER=18095551234
```

```bash
npm run dev
```

Abre `http://localhost:5173` para el sitio público y
`http://localhost:5173/admin` para el panel (te va a mandar a iniciar sesión).

## 3. Desplegar en Vercel o Netlify

1. Sube este proyecto a un repositorio de GitHub.
2. En Vercel o Netlify, "Import Project" desde ese repo.
3. En la configuración de variables de entorno del proyecto (Environment
   Variables), agrega las mismas tres del `.env`:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`.
4. Deploy. Framework preset: **Vite** (build command `npm run build`,
   output folder `dist`).

## Cómo administrar los productos

Entra a `tu-dominio.com/admin`, inicia sesión con el correo/contraseña que
creaste en Supabase Authentication, y desde ahí puedes:

- **Agregar producto**: nombre, precio, categoría y foto (se sube directo a
  Supabase Storage).
- **Editar**: clic en "Editar" en la fila del producto.
- **Ocultar/mostrar**: clic en la pastilla "Visible/Oculto" — un producto
  oculto no aparece en la página pública pero no se borra.
- **Eliminar**: clic en "Eliminar" (pide confirmación).

Los cambios se reflejan en la página pública al instante (no hace falta
volver a desplegar nada).

## Pendiente / personalizable

- El mapa de la sección "Ubicación" está como marcador de posición —
  se puede reemplazar por un iframe de Google Maps con tu dirección exacta.
- El número de WhatsApp y la dirección/horario del footer están fijos en
  `StorefrontPage.jsx` — se pueden mover a una tabla `settings` en Supabase
  si quieres editarlos también desde el admin más adelante.
# acuariofilia_web
