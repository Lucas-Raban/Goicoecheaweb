import "server-only";
import { getPropiedadesPanel } from "./sanity";
import { getPropiedadesTokko } from "./tokko";

// Todas las propiedades de la web: primero las cargadas en el panel, después las de Tokko.
export async function getPropiedades() {
  const [panel, tokko] = await Promise.all([getPropiedadesPanel(), getPropiedadesTokko()]);
  return [...panel, ...tokko];
}

export async function getPropiedad(slug: string) {
  return (await getPropiedades()).find((p) => p.slug === slug);
}
