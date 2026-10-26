import "server-only";
import { getPropiedades } from "./propiedades";
import { getEmprendimientosPanel } from "./sanity";
import { getEmprendimientosTokko } from "./tokko";

// Todos los emprendimientos: primero los cargados en el panel, después los de Tokko. Los destacados van adelante.
export async function getEmprendimientos() {
  const [panel, tokko] = await Promise.all([getEmprendimientosPanel(), getEmprendimientosTokko()]);
  const todos = [...panel, ...tokko];
  return [...todos.filter((e) => e.destacado), ...todos.filter((e) => !e.destacado)];
}

export async function getEmprendimiento(slug: string) {
  return (await getEmprendimientos()).find((e) => e.slug === slug);
}

// Unidades disponibles de un emprendimiento.
export async function getUnidades(id: string) {
  return (await getPropiedades()).filter((p) => p.emprendimiento === id);
}
