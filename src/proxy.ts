import { NextResponse, type NextRequest } from "next/server";

// Direcciones de la web anterior (Tokko) que Google ya tiene indexadas. Redirigen con 301 para no perder posicionamiento.
// La comparación distingue mayúsculas, así /Venta redirige pero /venta sigue de largo.
const anteriores: Record<string, string> = {
  "/Venta": "/venta",
  "/Alquiler": "/alquiler",
  "/Alquiler-temporario": "/alquiler-temporario",
  "/Departamentos": "/venta/departamentos",
  "/Casas": "/venta/casas",
  "/Terrenos": "/venta/terrenos",
  "/locales": "/venta/locales",
  "/s/La-Empresa": "/nosotros",
  "/Contacto": "/contacto",
};

export function proxy(request: NextRequest) {
  const destino = anteriores[request.nextUrl.pathname.replace(/\/$/, "")];
  if (!destino) return NextResponse.next();
  return NextResponse.redirect(new URL(destino, request.url), 301);
}

export const config = {
  matcher: ["/Venta", "/Alquiler", "/Alquiler-temporario", "/Departamentos", "/Casas", "/Terrenos", "/locales", "/s/:path*", "/Contacto"],
};
