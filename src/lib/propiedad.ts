// Tipos y nombres compartidos entre el servidor y los componentes del navegador.
export type Operacion = "venta" | "alquiler" | "temporario";

export type Propiedad = {
  id: number;
  slug: string;
  codigo: string;
  titulo: string;
  direccion: string;
  barrio: string;
  barrioSlug: string;
  tipo: string;
  operaciones: { tipo: Operacion; precio: string | null }[];
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  cocheras: number | null;
  superficieTotal: number | null;
  superficieCubierta: number | null;
  descripcion: string;
  fotos: { url: string; descripcion: string }[];
  videos: string[];
  tours: string[];
  lat: number | null;
  lng: number | null;
  destacada: boolean;
};

export const nombresOperacion: Record<Operacion, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  temporario: "Alquiler temporario",
};

export const rutasOperacion: Record<Operacion, string> = {
  venta: "/venta",
  alquiler: "/alquiler",
  temporario: "/alquiler-temporario",
};
