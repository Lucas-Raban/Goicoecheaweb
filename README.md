# Goicoechea Propiedades: web

Nueva web de Goicoechea Propiedades (inmobiliaria en Mar del Plata), hecha con Next.js y Tailwind CSS, pensada para publicarse en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (por defecto `https://goicoecheapropiedades.com`). |
| `TOKKO_API_KEY` | API key de Tokko Broker. Sin ella la web muestra el aviso de catálogo en preparación. |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Código de verificación de Google Search Console (opcional). |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto de Sanity para el panel de carga (/admin). |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset de Sanity (por defecto `production`). |
| `SANITY_REVALIDATE_SECRET` | Secreto del webhook de Sanity que actualiza la web al publicar (`/api/revalidar`). |
| `NEXT_PUBLIC_INDEXAR` | Poner `true` solo cuando la web nueva reemplace a la actual. Mientras tanto Google no la indexa. |

## Estructura

- `src/lib/site.ts`: datos del negocio (dirección, WhatsApp, redes).
- `src/lib/barrios.ts`: barrios y sus textos para las páginas por barrio.
- `src/lib/tokko.ts`: lectura de propiedades desde la API de Tokko (se actualiza cada hora).
- `src/lib/sanity.ts` y `src/sanity/`: propiedades cargadas a mano en el panel `/admin` (Sanity).
- `src/lib/propiedades.ts`: une las dos fuentes.
- `src/lib/fotos.ts`: fotos generales del sitio (reemplazar por propias).
- `src/app/`: páginas (inicio, propiedades, tasaciones, nosotros, contacto), sitemap y robots.
- `src/components/`: header, footer, botón de WhatsApp y formularios.
- `public/marca/`: logos.

## Plan

1. Base del sitio con la marca aplicada (hecho).
2. Catálogo de propiedades leído desde la API de Tokko, con fotos, video y tour 360 (hecho; falta cargar la API key).
3. Captación de contactos (formularios a email/CRM, alertas).
4. SEO local: páginas por barrio y operación y datos estructurados (hecho); blog pendiente.
