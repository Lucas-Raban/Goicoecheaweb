import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { linkIncrustable, type Operacion, type Propiedad } from "./propiedad";
import { slugify } from "./texto";

// Lo que devuelve la API de Tokko (solo los campos que usamos).
type TokkoPropiedad = {
  id: number;
  reference_code?: string;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  location?: { name?: string; full_location?: string };
  type?: { name?: string };
  operations?: { operation_type?: string; prices?: { currency?: string; price?: number; period?: number }[] }[];
  room_amount?: number;
  suite_amount?: number;
  bathroom_amount?: number;
  parking_lot_amount?: number;
  total_surface?: string | number;
  roofed_surface?: string | number;
  description?: string;
  photos?: { image?: string; original?: string; description?: string; is_front_cover?: boolean; is_blueprint?: boolean; order?: number }[];
  videos?: { player_url?: string; url?: string; provider?: string }[];
  geo_lat?: string | number;
  geo_long?: string | number;
  is_starred_on_web?: boolean;
  web_price?: boolean;
};

const API = "https://www.tokkobroker.com/api/v1/property/";

function numero(v: unknown) {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

function tipoOperacion(nombre = ""): Operacion | null {
  const n = nombre.toLowerCase();
  if (n.includes("temporario")) return "temporario";
  if (n.includes("alquiler")) return "alquiler";
  if (n.includes("venta")) return "venta";
  return null;
}

function formatearPrecio(moneda = "", precio?: number) {
  if (!precio) return null;
  const simbolo = moneda === "USD" ? "USD" : moneda === "ARS" ? "$" : moneda;
  return `${simbolo} ${precio.toLocaleString("es-AR")}`;
}

const esTour = (url: string) => /matterport|kuula|roundme|360|tour/i.test(url);

function normalizar(p: TokkoPropiedad): Propiedad {
  const tipo = p.type?.name ?? "Propiedad";
  const barrio = p.location?.name ?? "Mar del Plata";
  const operaciones = (p.operations ?? []).flatMap((op) => {
    const t = tipoOperacion(op.operation_type);
    if (!t) return [];
    const precio = p.web_price === false ? null : formatearPrecio(op.prices?.[0]?.currency, op.prices?.[0]?.price);
    return [{ tipo: t, precio }];
  });
  const ordenadas = [...(p.photos ?? [])]
    .filter((f) => f.image)
    .sort((a, b) => Number(b.is_front_cover) - Number(a.is_front_cover) || (a.order ?? 0) - (b.order ?? 0));
  const fotos = ordenadas.filter((f) => !f.is_blueprint).map((f) => ({ url: f.image!, descripcion: f.description ?? "" }));
  const planos = ordenadas.filter((f) => f.is_blueprint).map((f) => ({ url: f.image!, descripcion: f.description ?? "" }));
  const enlaces = (p.videos ?? []).map((v) => v.player_url || v.url || "").filter(Boolean);
  const ambientes = numero(p.room_amount);
  const titulo = p.publication_title || `${tipo} en ${barrio}`;
  const slug = slugify(
    [tipo, operaciones[0]?.tipo ?? "", barrio, ambientes === 1 ? "monoambiente" : ambientes ? `${ambientes}-ambientes` : "", String(p.id)].filter(Boolean).join("-"),
  );

  return {
    id: `tokko-${p.id}`,
    origen: "tokko",
    slug,
    codigo: p.reference_code ?? String(p.id),
    titulo,
    direccion: p.fake_address || p.address || barrio,
    barrio,
    barrioSlug: slugify(barrio),
    tipo,
    operaciones,
    ambientes,
    dormitorios: numero(p.suite_amount),
    banos: numero(p.bathroom_amount),
    cocheras: numero(p.parking_lot_amount),
    superficieTotal: numero(p.total_surface),
    superficieCubierta: numero(p.roofed_surface),
    descripcion: p.description ?? "",
    fotos,
    videos: enlaces.filter((u) => !esTour(u)).map(linkIncrustable),
    videosArchivo: [],
    tours: enlaces.filter(esTour),
    panoramas: [],
    planos,
    maqueta: null,
    lat: numero(p.geo_lat),
    lng: numero(p.geo_long),
    destacada: Boolean(p.is_starred_on_web),
  };
}

async function leerFixture(ruta: string) {
  const { readFile } = await import("node:fs/promises");
  return JSON.parse(await readFile(ruta, "utf8")) as { objects: TokkoPropiedad[] };
}

// Trae todas las propiedades publicadas en Tokko. Sin API key devuelve una lista vacía
// y la web muestra el aviso de catálogo en preparación.
export async function getPropiedadesTokko(): Promise<Propiedad[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("propiedades");

  // Solo para probar en local sin conexión a Tokko.
  if (process.env.TOKKO_FIXTURE) {
    return (await leerFixture(process.env.TOKKO_FIXTURE)).objects.map(normalizar);
  }

  const key = process.env.TOKKO_API_KEY;
  if (!key) return [];

  const todas: TokkoPropiedad[] = [];
  let url: string | null = `${API}?key=${key}&format=json&lang=es_ar&limit=100`;
  try {
    while (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Tokko respondió ${res.status}`);
      const pagina = (await res.json()) as { objects: TokkoPropiedad[]; meta?: { next?: string | null } };
      todas.push(...pagina.objects);
      url = pagina.meta?.next ? new URL(pagina.meta.next, API).toString() : null;
    }
  } catch (error) {
    console.error("No se pudieron leer las propiedades de Tokko", error);
    return [];
  }
  return todas.map(normalizar);
}
