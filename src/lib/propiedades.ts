import "server-only";
import { getPropiedadesPanel } from "./sanity";
import { getPropiedadesTokko } from "./tokko";
import type { Propiedad } from "./propiedad";

// Momento de carga en milisegundos. Tokko devuelve fechas sin zona horaria; da igual para ordenar.
function cargada(p: Propiedad) {
  const t = p.publicadaEl ? Date.parse(p.publicadaEl) : NaN;
  return Number.isFinite(t) ? t : 0;
}

// En Tokko el número de id crece con cada propiedad nueva: sirve de desempate si falta la fecha.
function idTokko(p: Propiedad) {
  return p.origen === "tokko" ? Number(p.id.slice("tokko-".length)) || 0 : 0;
}

// Todas las propiedades de la web (panel y Tokko), de la más nueva a la más vieja.
export async function getPropiedades() {
  const [panel, tokko] = await Promise.all([getPropiedadesPanel(), getPropiedadesTokko()]);
  return [...panel, ...tokko].sort((a, b) => cargada(b) - cargada(a) || idTokko(b) - idTokko(a));
}

export async function getPropiedad(slug: string) {
  return (await getPropiedades()).find((p) => p.slug === slug);
}
