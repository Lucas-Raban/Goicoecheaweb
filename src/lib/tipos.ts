import { slugify } from "./texto";

// Tipos de propiedad con página propia por operación (ej. /venta/departamentos).
export const listaTipos = [
  { slug: "departamentos", tipo: "Departamento", plural: "Departamentos" },
  { slug: "casas", tipo: "Casa", plural: "Casas" },
  { slug: "ph", tipo: "PH", plural: "PH" },
  { slug: "locales", tipo: "Local", plural: "Locales" },
  { slug: "oficinas", tipo: "Oficina", plural: "Oficinas" },
  { slug: "terrenos", tipo: "Terreno", plural: "Terrenos" },
  { slug: "galpones", tipo: "Galpón", plural: "Galpones" },
  { slug: "cocheras", tipo: "Cochera", plural: "Cocheras" },
];

export function buscarTipo(slug: string) {
  return listaTipos.find((t) => t.slug === slug);
}

export function esDelTipo(tipoPropiedad: string, slug: string) {
  const t = buscarTipo(slug);
  return Boolean(t && slugify(tipoPropiedad) === slugify(t.tipo));
}
