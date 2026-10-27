import { nombresOperacion } from "@/lib/propiedad";
import { getPropiedad } from "@/lib/propiedades";
import { imagenVistaPrevia, tamanoVistaPrevia } from "@/lib/vista-previa";

export const alt = "Foto de la propiedad";
export const size = tamanoVistaPrevia;
export const contentType = "image/jpeg";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPropiedad((await params).slug);
  const op = p?.operaciones[0];
  return imagenVistaPrevia({
    foto: p?.fotos[0]?.url,
    antetitulo: p ? `${p.tipo}${op ? ` en ${nombresOperacion[op.tipo].toLowerCase()}` : ""} · ${p.barrio}` : "Goicoechea Propiedades",
    titulo: p?.direccion ?? "Inmobiliaria en Mar del Plata",
    precio: op?.precio,
  });
}
