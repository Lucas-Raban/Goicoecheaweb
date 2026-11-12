import "server-only";
import { getMultimediaTokko, getPropiedadesPanel, type MultimediaTokko } from "./sanity";
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
// Suma a una propiedad de Tokko el tour 360, la maqueta, los planos y los videos cargados en el panel.
function conMultimedia(p: Propiedad, extras: MultimediaTokko[]): Propiedad {
  if (p.origen !== "tokko") return p;
  const extra = extras.find((e) => e.codigo === p.codigo || e.codigo === String(idTokko(p)));
  if (!extra) return p;
  return {
    ...p,
    videos: [...p.videos, ...extra.videos],
    videosArchivo: [...p.videosArchivo, ...extra.videosArchivo],
    tours: [...p.tours, ...extra.tours],
    panoramas: [...p.panoramas, ...extra.panoramas],
    planos: [...p.planos, ...extra.planos],
    maqueta: extra.maqueta ?? p.maqueta,
  };
}

export async function getPropiedades() {
  const [panel, tokko, extras] = await Promise.all([getPropiedadesPanel(), getPropiedadesTokko(), getMultimediaTokko()]);
  return [...panel, ...tokko.map((p) => conMultimedia(p, extras))].sort((a, b) => cargada(b) - cargada(a) || idTokko(b) - idTokko(a));
}

export async function getPropiedad(slug: string) {
  return (await getPropiedades()).find((p) => p.slug === slug);
}
