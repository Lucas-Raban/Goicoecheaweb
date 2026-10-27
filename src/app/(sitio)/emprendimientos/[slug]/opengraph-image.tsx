import { getEmprendimiento } from "@/lib/emprendimientos";
import { imagenVistaPrevia, tamanoVistaPrevia } from "@/lib/vista-previa";

export const alt = "Foto del emprendimiento";
export const size = tamanoVistaPrevia;
export const contentType = "image/jpeg";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const e = await getEmprendimiento((await params).slug);
  return imagenVistaPrevia({
    foto: e?.fotos[0]?.url,
    antetitulo: e ? `Emprendimiento${e.estado ? ` ${e.estado.toLowerCase()}` : ""} · ${e.barrio}` : "Goicoechea Propiedades",
    titulo: e?.nombre ?? "Emprendimientos en Mar del Plata",
    precio: e?.precioDesde ? `Desde ${e.precioDesde}` : null,
  });
}
