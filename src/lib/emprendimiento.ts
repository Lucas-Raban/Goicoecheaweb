import type { Multimediales } from "./propiedad";

// Edificio en pozo o en construcción. Sus unidades son propiedades comunes que apuntan a él.
export type Emprendimiento = Multimediales & {
  id: string;
  origen: "tokko" | "panel";
  slug: string;
  nombre: string;
  barrio: string;
  barrioSlug: string;
  // En pozo, En construcción o Terminado.
  estado: string | null;
  // Fecha de entrega estimada, ej. "Diciembre 2027".
  entrega: string | null;
  precioDesde: string | null;
  descripcion: string;
  financiacion: string;
  amenities: string[];
  lat: number | null;
  lng: number | null;
  destacado: boolean;
};
