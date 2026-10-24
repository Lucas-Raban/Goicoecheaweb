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
| `NEXT_PUBLIC_INDEXAR` | Poner `true` solo cuando la web nueva reemplace a la actual. Mientras tanto Google no la indexa. |

## Estructura

- `src/lib/site.ts`: datos del negocio (dirección, WhatsApp, redes, barrios).
- `src/app/`: páginas (inicio, propiedades, tasaciones, nosotros, contacto), sitemap y robots.
- `src/components/`: header, footer, botón de WhatsApp y formularios.
- `public/marca/`: logos.

## Plan

1. Base del sitio con la marca aplicada (hecho).
2. Catálogo de propiedades leído desde la API de Tokko, con fotos, video y tour 360.
3. Captación de contactos (formularios a email/CRM, alertas).
4. SEO local: páginas por barrio y operación, datos estructurados, blog.
