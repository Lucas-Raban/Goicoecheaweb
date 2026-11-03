import type { Moneda, Operacion, Propiedad } from "./propiedad";
import { slugify } from "./texto";

// Filtros del buscador, tal como llegan en la dirección (?operacion=venta&ambientes=3...).
// Todos son opcionales: lo que no se completa no filtra.
export type Filtros = {
  operacion: Operacion | null;
  tipo: string | null;
  barrio: string | null;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  cochera: boolean;
  moneda: Moneda;
  precioMin: number | null;
  precioMax: number | null;
  expensasMax: number | null;
  superficieMin: number | null;
};

// "150.000" o "USD 150000" → 150000
export function leerNumero(v: string | null) {
  const n = parseInt((v ?? "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function leerFiltros(params: { get(nombre: string): string | null }): Filtros {
  const operacion = params.get("operacion");
  const moneda = params.get("moneda");
  return {
    operacion: operacion === "venta" || operacion === "alquiler" || operacion === "temporario" ? operacion : null,
    tipo: params.get("tipo") || null,
    barrio: params.get("barrio") || null,
    ambientes: leerNumero(params.get("ambientes")),
    dormitorios: leerNumero(params.get("dormitorios")),
    banos: leerNumero(params.get("banos")),
    cochera: params.get("cochera") === "si",
    // Venta en dólares y alquileres en pesos, salvo que se elija otra moneda.
    moneda: moneda === "USD" || moneda === "ARS" ? moneda : operacion === "venta" || !operacion ? "USD" : "ARS",
    precioMin: leerNumero(params.get("precioMin")),
    precioMax: leerNumero(params.get("precioMax")),
    expensasMax: leerNumero(params.get("expensasMax")),
    superficieMin: leerNumero(params.get("superficieMin")),
  };
}

// 5 ambientes o más se agrupan en "5+".
export const MAX_AMBIENTES = 5;

export function cumple(p: Propiedad, f: Filtros) {
  const ops = f.operacion ? p.operaciones.filter((o) => o.tipo === f.operacion) : p.operaciones;
  if (ops.length === 0) return false;
  if (f.tipo && slugify(p.tipo) !== slugify(f.tipo)) return false;
  if (f.barrio && p.barrioSlug !== slugify(f.barrio)) return false;
  if (f.ambientes && (p.ambientes == null || (f.ambientes >= MAX_AMBIENTES ? p.ambientes < MAX_AMBIENTES : p.ambientes !== f.ambientes))) return false;
  if (f.dormitorios && (p.dormitorios ?? 0) < f.dormitorios) return false;
  if (f.banos && (p.banos ?? 0) < f.banos) return false;
  if (f.cochera && !p.cocheras) return false;
  // Con un precio elegido, quedan afuera las que dicen "Consultar precio" o están en otra moneda.
  if (f.precioMin || f.precioMax) {
    const enPrecio = ops.some(
      (o) => o.valor != null && o.moneda === f.moneda && (!f.precioMin || o.valor >= f.precioMin) && (!f.precioMax || o.valor <= f.precioMax),
    );
    if (!enPrecio) return false;
  }
  // Las que no tienen expensas cargadas (casas, terrenos) no se descartan.
  if (f.expensasMax && p.expensas != null && p.expensas > f.expensasMax) return false;
  const superficie = p.superficieCubierta ?? p.superficieTotal;
  if (f.superficieMin && (superficie == null || superficie < f.superficieMin)) return false;
  return true;
}

const nombresOp: Record<Operacion, string> = { venta: "en venta", alquiler: "en alquiler", temporario: "alquiler temporario" };
const plata = (n: number, m: Moneda) => `${m === "USD" ? "USD" : "$"} ${n.toLocaleString("es-AR")}`;

// Resumen legible de lo que se filtró: "en venta, Casa, 3 ambientes, hasta USD 150.000".
export function describirFiltros(f: Filtros) {
  return [
    f.operacion && nombresOp[f.operacion],
    f.tipo,
    f.barrio,
    f.ambientes && (f.ambientes === 1 ? "monoambiente" : f.ambientes >= MAX_AMBIENTES ? `${MAX_AMBIENTES} ambientes o más` : `${f.ambientes} ambientes`),
    f.dormitorios && `${f.dormitorios}+ dormitorios`,
    f.banos && `${f.banos}+ baños`,
    f.cochera && "con cochera",
    f.precioMin && f.precioMax
      ? `${plata(f.precioMin, f.moneda)} a ${plata(f.precioMax, f.moneda)}`
      : f.precioMin
        ? `desde ${plata(f.precioMin, f.moneda)}`
        : f.precioMax && `hasta ${plata(f.precioMax, f.moneda)}`,
    f.expensasMax && `expensas hasta ${plata(f.expensasMax, "ARS")}`,
    f.superficieMin && `desde ${f.superficieMin} m²`,
  ].filter(Boolean) as string[];
}
