import "server-only";
import { getAsesoresPanel } from "./sanity";
import { equipo, type Asesor } from "./site";
import { slugify } from "./texto";

// Asesores que se muestran en la web: los activos del panel o, si todavía no hay ninguno, los de respaldo de site.ts.
export async function getAsesores(): Promise<Asesor[]> {
  const panel = await getAsesoresPanel();
  return panel.length > 0 ? panel : equipo;
}

// Asesor a cargo de una propiedad, buscado por nombre entre los activos. Si se dio de baja, la consulta va a la inmobiliaria.
export async function getAsesor(nombre: string | null): Promise<Asesor | undefined> {
  if (!nombre) return undefined;
  const buscado = slugify(nombre);
  return (await getAsesores()).find((a) => slugify(a.nombre) === buscado);
}
