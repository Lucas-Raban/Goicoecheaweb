import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Emprendimiento } from "./emprendimiento";
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
  development?: { id?: number } | null;
  producer?: { name?: string } | null;
};

const API = "https://www.tokkobroker.com/api/v1/";

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
    emprendimiento: p.development?.id ? `tokko-${p.development.id}` : null,
    asesor: p.producer?.name || null,
  };
}

async function leerFixture<T>(ruta: string) {
  const { readFile } = await import("node:fs/promises");
  return (JSON.parse(await readFile(ruta, "utf8")) as { objects: T[] }).objects;
}

// Recorre todas las páginas de un listado de la API (propiedades o emprendimientos).
async function leerTodo<T>(recurso: "property" | "development", fixture?: string): Promise<T[]> {
  // Solo para probar en local sin conexión a Tokko.
  if (fixture) return leerFixture<T>(fixture);

  const key = process.env.TOKKO_API_KEY;
  if (!key) return [];

  const base = `${API}${recurso}/`;
  const todos: T[] = [];
  let url: string | null = `${base}?key=${key}&format=json&lang=es_ar&limit=100`;
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Tokko respondió ${res.status}`);
    const pagina = (await res.json()) as { objects: T[]; meta?: { next?: string | null } };
    todos.push(...pagina.objects);
    url = pagina.meta?.next ? new URL(pagina.meta.next, base).toString() : null;
  }
  return todos;
}

// Trae todas las propiedades publicadas en Tokko. Sin API key devuelve una lista vacía
// y la web muestra el aviso de catálogo en preparación.
export async function getPropiedadesTokko(): Promise<Propiedad[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("propiedades");

  try {
    return (await leerTodo<TokkoPropiedad>("property", process.env.TOKKO_FIXTURE)).map(normalizar);
  } catch (error) {
    console.error("No se pudieron leer las propiedades de Tokko", error);
    return [];
  }
}

// Emprendimientos (edificios en pozo o en construcción) tal como los devuelve Tokko.
type TokkoEmprendimiento = {
  id: number;
  name?: string;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  location?: { name?: string };
  description?: string;
  financing_details?: string;
  construction_date?: string;
  construction_status?: number | string;
  display_on_web?: boolean;
  is_starred_on_web?: boolean;
  photos?: TokkoPropiedad["photos"];
  videos?: TokkoPropiedad["videos"];
  tags?: { name?: string }[];
  geo_lat?: string | number;
  geo_long?: string | number;
};

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// "2027-12-01" → "Diciembre 2027"
function fechaEntrega(fecha?: string) {
  const m = fecha?.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  const mes = meses[parseInt(m[2], 10) - 1];
  return mes ? `${mes[0].toUpperCase()}${mes.slice(1)} ${m[1]}` : m[1];
}

function normalizarEmprendimiento(e: TokkoEmprendimiento): Emprendimiento {
  const nombre = e.name || e.publication_title || "Emprendimiento";
  const barrio = e.location?.name ?? "Mar del Plata";
  const ordenadas = [...(e.photos ?? [])]
    .filter((f) => f.image)
    .sort((a, b) => Number(b.is_front_cover) - Number(a.is_front_cover) || (a.order ?? 0) - (b.order ?? 0));
  const enlaces = (e.videos ?? []).map((v) => v.player_url || v.url || "").filter(Boolean);
  return {
    id: `tokko-${e.id}`,
    origen: "tokko",
    slug: slugify(`${nombre}-${barrio}-${e.id}`),
    nombre,
    direccion: e.fake_address || e.address || barrio,
    barrio,
    barrioSlug: slugify(barrio),
    // Tokko devuelve el estado como número sin nombre; solo se muestra si viene escrito.
    estado: typeof e.construction_status === "string" && e.construction_status ? e.construction_status : null,
    entrega: fechaEntrega(e.construction_date),
    precioDesde: null,
    descripcion: e.description ?? "",
    financiacion: e.financing_details ?? "",
    amenities: (e.tags ?? []).map((t) => t.name ?? "").filter(Boolean),
    fotos: ordenadas.filter((f) => !f.is_blueprint).map((f) => ({ url: f.image!, descripcion: f.description ?? "" })),
    planos: ordenadas.filter((f) => f.is_blueprint).map((f) => ({ url: f.image!, descripcion: f.description ?? "" })),
    videos: enlaces.filter((u) => !esTour(u)).map(linkIncrustable),
    videosArchivo: [],
    tours: enlaces.filter(esTour),
    panoramas: [],
    maqueta: null,
    lat: numero(e.geo_lat),
    lng: numero(e.geo_long),
    destacado: Boolean(e.is_starred_on_web),
  };
}

// Emprendimientos publicados en Tokko. Sus unidades son las propiedades que Tokko asocia a cada uno.
export async function getEmprendimientosTokko(): Promise<Emprendimiento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("propiedades");

  try {
    const todos = await leerTodo<TokkoEmprendimiento>("development", process.env.TOKKO_FIXTURE_EMPRENDIMIENTOS);
    return todos.filter((e) => e.display_on_web !== false).map(normalizarEmprendimiento);
  } catch (error) {
    console.error("No se pudieron leer los emprendimientos de Tokko", error);
    return [];
  }
}
