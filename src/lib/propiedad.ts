// Tipos y nombres compartidos entre el servidor y los componentes del navegador.
export type Operacion = "venta" | "alquiler" | "temporario";

export type Propiedad = {
  id: string;
  origen: "tokko" | "panel";
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
  videosArchivo: string[];
  tours: string[];
  panoramas: { url: string; ambiente: string }[];
  planos: { url: string; descripcion: string }[];
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

// Convierte links de YouTube o Vimeo al formato que se puede incrustar en la página.
export function linkIncrustable(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}
