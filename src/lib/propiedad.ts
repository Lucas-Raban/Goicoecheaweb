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
  // Dirección interna de la maqueta 3D (/maqueta/<id>), si se subió en el panel.
  maqueta: string | null;
  lat: number | null;
  lng: number | null;
  destacada: boolean;
  // Id del emprendimiento al que pertenece la unidad, si es parte de uno.
  emprendimiento: string | null;
};

// Lo que muestran las solapas de fotos, video, tour, plano y maqueta (fichas de propiedades y de emprendimientos).
export type Multimediales = Pick<Propiedad, "direccion" | "fotos" | "videos" | "videosArchivo" | "tours" | "panoramas" | "planos" | "maqueta">;

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
