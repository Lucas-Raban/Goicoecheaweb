import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "next-sanity";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "@/sanity/env";
import { linkIncrustable, type Propiedad } from "./propiedad";
import type { Asesor } from "./site";
import { slugify } from "./texto";

type PropiedadPanel = {
  _id: string;
  destacada?: boolean;
  titulo: string;
  operacion: "venta" | "alquiler" | "temporario";
  tipo: string;
  direccion: string;
  barrio: string;
  otroBarrio?: string;
  precio?: number;
  moneda?: string;
  mostrarPrecio?: boolean;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  cocheras?: number;
  superficieCubierta?: number;
  superficieTotal?: number;
  codigo?: string;
  descripcion?: string;
  ubicacion?: string;
  fotos?: { url: string; descripcion?: string }[];
  videos?: string[];
  videosArchivo?: string[];
  tours?: string[];
  panoramas?: { ambiente?: string; url?: string }[];
  planos?: { url: string; descripcion?: string }[];
  maqueta?: string;
};

const consulta = `*[_type == "propiedad" && publicada != false && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id, destacada, titulo, operacion, tipo, direccion, barrio, otroBarrio, precio, moneda, mostrarPrecio,
  ambientes, dormitorios, banos, cocheras, superficieCubierta, superficieTotal, codigo, descripcion, ubicacion,
  "fotos": fotos[]{ "url": asset->url, descripcion },
  videos, "videosArchivo": videosArchivo[].asset->url, tours,
  "panoramas": panoramas[]{ ambiente, "url": imagen.asset->url },
  "planos": planos[]{ "url": asset->url, descripcion },
  "maqueta": maqueta.asset->url
}`;

// Saca latitud y longitud de un link de Google Maps (formatos @lat,lng o q=lat,lng).
function coordenadas(link?: string) {
  const m = link?.match(/(?:@|q=)(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  return m ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } : { lat: null, lng: null };
}

function normalizar(p: PropiedadPanel): Propiedad {
  const barrio = p.barrio === "Otro" ? p.otroBarrio || "Mar del Plata" : p.barrio;
  const codigo = p.codigo || p._id.slice(-6).toUpperCase();
  const precio =
    p.precio && p.mostrarPrecio !== false ? `${p.moneda === "ARS" ? "$" : "USD"} ${p.precio.toLocaleString("es-AR")}` : null;
  const { lat, lng } = coordenadas(p.ubicacion);
  return {
    id: `panel-${p._id}`,
    origen: "panel",
    slug: slugify(
      [p.tipo, p.operacion, barrio, p.ambientes === 1 ? "monoambiente" : p.ambientes ? `${p.ambientes}-ambientes` : "", codigo]
        .filter(Boolean)
        .join("-"),
    ),
    codigo,
    titulo: p.titulo,
    direccion: p.direccion,
    barrio,
    barrioSlug: slugify(barrio),
    tipo: p.tipo,
    operaciones: [{ tipo: p.operacion, precio }],
    ambientes: p.ambientes ?? null,
    dormitorios: p.dormitorios ?? null,
    banos: p.banos ?? null,
    cocheras: p.cocheras ?? null,
    superficieTotal: p.superficieTotal ?? null,
    superficieCubierta: p.superficieCubierta ?? null,
    descripcion: p.descripcion ?? "",
    fotos: (p.fotos ?? []).filter((f) => f.url).map((f) => ({ url: `${f.url}?w=1800&auto=format`, descripcion: f.descripcion ?? "" })),
    videos: (p.videos ?? []).filter(Boolean).map(linkIncrustable),
    videosArchivo: (p.videosArchivo ?? []).filter(Boolean),
    // Los artifacts de Claude no se pueden incrustar en otra página, así que se descartan.
    maqueta: p.maqueta ? `/maqueta/${p._id}` : null,
    planos: (p.planos ?? []).filter((f) => f.url).map((f) => ({ url: `${f.url}?w=2400&auto=format`, descripcion: f.descripcion ?? "" })),
    tours: (p.tours ?? []).filter((t) => t && !t.includes("claude.ai")),
    panoramas: (p.panoramas ?? [])
      .filter((f) => f.url)
      .map((f, i) => ({ url: `${f.url}?w=6000&auto=format`, ambiente: f.ambiente || `Ambiente ${i + 1}` })),
    lat,
    lng,
    destacada: Boolean(p.destacada),
  };
}

// Propiedades cargadas a mano en /admin. Sin proyecto de Sanity configurado devuelve una lista vacía.
// Se refresca cada minuto para que lo publicado aparezca enseguida aunque no haya webhook.
export async function getPropiedadesPanel(): Promise<Propiedad[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("propiedades");

  if (!sanityProjectId) return [];
  const cliente = createClient({ projectId: sanityProjectId, dataset: sanityDataset, apiVersion: sanityApiVersion, useCdn: false });
  try {
    const datos = await cliente.fetch<PropiedadPanel[]>(consulta);
    return datos.map(normalizar);
  } catch (error) {
    console.error("No se pudieron leer las propiedades del panel", error);
    return [];
  }
}

type AsesorPanel = {
  nombre: string;
  cargo?: string;
  whatsapp?: string;
  instagram?: string;
  esLogo?: boolean;
  foto?: string;
  hotspot?: { x: number; y: number };
};

// Acepta el número local (2234399282) o con código de país, y lo deja listo para wa.me.
function numeroWhatsapp(valor?: string) {
  const digitos = valor?.replace(/\D/g, "") ?? "";
  if (!digitos) return undefined;
  if (digitos.startsWith("54")) return digitos;
  return `549${digitos.replace(/^0/, "").replace(/^(\d{2,4})15/, "$1")}`;
}

// Asesores cargados en /admin, en el orden elegido. Vacío si no hay ninguno publicado.
export async function getAsesoresPanel(): Promise<Asesor[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("asesores");

  if (!sanityProjectId) return [];
  const cliente = createClient({ projectId: sanityProjectId, dataset: sanityDataset, apiVersion: sanityApiVersion, useCdn: false });
  try {
    const datos = await cliente.fetch<AsesorPanel[]>(
      `*[_type == "asesor" && activo != false && !(_id in path("drafts.**"))] | order(orden asc, nombre asc) {
        nombre, cargo, whatsapp, instagram, esLogo, "foto": foto.asset->url, "hotspot": foto.hotspot
      }`,
    );
    return datos
      .filter((a) => a.nombre)
      .map((a) => ({
        nombre: a.nombre,
        cargo: a.cargo || "Asesor inmobiliario",
        whatsapp: numeroWhatsapp(a.whatsapp),
        instagram: a.instagram,
        esLogo: Boolean(a.esLogo),
        foto: a.foto
          ? a.esLogo
            ? `${a.foto}?w=320&auto=format`
            : `${a.foto}?w=320&h=320&fit=crop&crop=focalpoint&fp-x=${a.hotspot?.x ?? 0.5}&fp-y=${a.hotspot?.y ?? 0.3}&auto=format`
          : undefined,
      }));
  } catch (error) {
    console.error("No se pudieron leer los asesores del panel", error);
    return [];
  }
}

// URL del archivo de la maqueta 3D de una propiedad publicada del panel.
export async function getMaquetaUrl(id: string): Promise<string | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("propiedades");

  if (!sanityProjectId || !/^[\w-]+$/.test(id)) return null;
  const cliente = createClient({ projectId: sanityProjectId, dataset: sanityDataset, apiVersion: sanityApiVersion, useCdn: false });
  try {
    return await cliente.fetch<string | null>(`*[_type == "propiedad" && _id == $id][0].maqueta.asset->url`, { id });
  } catch (error) {
    console.error("No se pudo leer la maqueta", error);
    return null;
  }
}
