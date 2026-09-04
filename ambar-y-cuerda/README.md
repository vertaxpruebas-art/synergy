# Ámbar & Cuerda — sitio de producción

Reconstrucción del demo de una sola página como aplicación Astro + Tailwind +
Supabase, lista para desplegar. Mantiene la dirección visual del demo
(paleta "atelier", Fraunces/Public Sans/IBM Plex Mono, hero con
scroll-crossfade cinematográfico) pero cambia la implementación:

| | Demo | Este proyecto |
|---|---|---|
| Estructura | 1 archivo HTML | Astro componentizado (`Hero/ScrollReel`, `StoryStage`, `ContactForm`, admin) |
| Imágenes | JPEG 480px en base64 | `astro:assets` (fotos estáticas) + transformación de imagen de Supabase Storage (fotos de producto), AVIF/WebP, srcset real, lazy-loading |
| Scroll del hero | listener de `scroll` permanente en toda la página | IntersectionObserver activa/desactiva un listener de `scroll` con rAF solo mientras el hero está en pantalla |
| Datos/stock | `localStorage`/estado en memoria, sin backend real | Postgres (Supabase) + Realtime; cualquier pestaña abierta ve "Agotado" al instante |
| Admin | sin autenticación — cualquiera con el link podía editar | Supabase Auth + Row Level Security (`admin_users`), ruta `/admin` con `noindex` |
| Contacto | solo mostraba un número | formulario real que envía correo vía Resend |
| SEO | contenido solo dentro del canvas de scroll | catálogo prerenderizado en HTML semántico + lista de respaldo `sr-only`, meta OG con imagen real |

## 1. Requisitos

- Node.js 20+
- Una cuenta de [Supabase](https://supabase.com) (gratis para empezar)
- Una cuenta de [Resend](https://resend.com) (gratis hasta 100 correos/día) para el formulario de contacto
- Una cuenta de [Vercel](https://vercel.com) (o Netlify) para el despliegue

## 2. Configura Supabase

1. Crea un proyecto nuevo en Supabase.
2. En **SQL Editor**, ejecuta el contenido de `supabase/migrations/0001_init.sql`.
   Esto crea la tabla `products`, la tabla `admin_users`, las políticas de
   Row Level Security (el catálogo publicado es de lectura pública; solo
   los usuarios listados en `admin_users` pueden escribir), y el bucket de
   Storage `product-photos`.
3. (Opcional) ejecuta `supabase/seed.sql` para tener productos de ejemplo.
4. Crea tu usuario admin: **Authentication → Users → Add user** (con email +
   contraseña). Copia su UUID.
5. En **SQL Editor**, dale acceso de administrador:
   ```sql
   insert into public.admin_users (user_id) values ('<uuid-del-usuario>');
   ```
6. En **Settings → API**, copia `Project URL` y `anon public key` — van en
   las variables de entorno `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`.
7. **Storage → product-photos**: si quieres redimensionado real de imágenes
   (AVIF/WebP + srcset automático), activa el add-on de transformación de
   imágenes del plan del proyecto. Sin él, las fotos se sirven en su tamaño
   original — el sitio sigue funcionando, solo pierdes la optimización
   automática hasta que lo actives.

## 3. Configura Resend (formulario de contacto)

1. Crea una cuenta en Resend y verifica un dominio (o usa el remitente de
   pruebas `onboarding@resend.dev` mientras validas todo).
2. Genera una API key.
3. Variables de entorno: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (tu correo real
   de recepción), `CONTACT_FROM_EMAIL` opcional una vez tengas dominio
   verificado.

## 4. Variables de entorno

Copia `.env.example` a `.env` y rellena los valores:

```bash
cp .env.example .env
```

## 5. Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`. El panel de administración está en
`/admin` (pide login).

## 6. Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En Vercel, "Add New Project" → importa el repo. El framework preset
   "Astro" se detecta solo (usa el adaptador `@astrojs/vercel` ya
   configurado en `astro.config.mjs`).
3. En **Environment Variables**, añade las mismas del `.env`:
   `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`,
   `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
4. Deploy. Cada push a `main` vuelve a desplegar automáticamente.

### Alternativa: Netlify

Cambia el adaptador en `astro.config.mjs`:

```js
import netlify from "@astrojs/netlify";
// ...
adapter: netlify(),
```

Instala `@astrojs/netlify`, configura las mismas variables de entorno en
**Site settings → Environment variables**, y despliega igual que cualquier
proyecto Astro (`netlify.toml` con `command = "npm run build"`,
`publish = "dist"` no hace falta — el adaptador gestiona las funciones).

## 7. Fotografía — qué pedirle al fotógrafo/cliente

El demo actual usa fotos comprimidas a 480px incrustadas en base64; en
pantalla completa se ven borrosas. Para que el hero se vea nítido en un
móvil de gama alta a pantalla completa:

- **Resolución mínima de entrega: 3000×4000 px** (o más) por foto, en
  orientación retrato 3:4 o 4:5. Esto cubre 2–3x el ancho de viewport típico
  de un móvil (390–430px CSS × densidad de píxel 3x ≈ 1200–1300px físicos;
  pedimos bastante más margen porque el hero hace zoom/crossfade y porque
  también se usa recortado en desktop).
- **Formato de entrega**: JPEG o HEIC sin comprimir agresivamente, o RAW si
  es posible (lo convertimos nosotros). Evita capturas ya reducidas de
  redes sociales.
- **Encuadre**: deja aire arriba y a los lados — el recorte real
  (`object-position: 50% 38%`) y el texto superpuesto varían por breakpoint,
  así que un encuadre muy ajustado a la pieza se corta mal en desktop ancho.
- El pipeline (Supabase Storage + transformación de imagen) genera
  automáticamente las variantes de 480/768/1080/1440/2160px en AVIF/WebP a
  partir del original — solo necesitas subir el archivo grande una vez desde
  `/admin`.

## 8. Rendimiento

- El hero usa un solo listener de `scroll` (pasivo, con rAF) que se
  activa/desactiva mediante `IntersectionObserver` según si el hero está en
  viewport — no hay listeners de scroll "siempre activos" en el resto de la
  página.
- Solo se escriben `opacity`/`transform` en cada frame (propiedades de
  compositor, no fuerzan reflow); la única lectura de layout por frame es
  `getBoundingClientRect()` del contenedor del reel.
- Antes de cada release, corre Lighthouse (Chrome DevTools → Lighthouse,
  perfil "Mobile", red simulada "Slow 4G") sobre la portada desplegada y
  confirma LCP < 2.5s. La imagen del primer frame se marca
  `fetchpriority="high"` + `loading="eager"` para adelantar su descarga;
  el resto de frames son `loading="lazy"`.

## 9. Accesibilidad

- Todo el contenido del catálogo existe en el DOM en todo momento (no solo
  mientras su stage está "activo" visualmente) y además hay una lista
  `sr-only` de respaldo — lectores de pantalla y buscadores lo ven siempre.
- Navegación por teclado: los indicadores del riel (`nav[aria-label]`) son
  botones tabulables que saltan a cada pieza.
- Overlay/scrim revisado para contraste AA del texto (`--bone` sobre la
  franja inferior oscurecida del hero).
- Rutas administrativas marcadas `noindex, nofollow`.
