import type { MetadataRoute } from "next";
import { listaBarrios } from "@/lib/barrios";
import { site } from "@/lib/site";
import { rutasOperacion, type Operacion } from "@/lib/propiedad";
import { getEmprendimientos } from "@/lib/emprendimientos";
import { getPropiedades } from "@/lib/propiedades";
import { esDelTipo, listaTipos } from "@/lib/tipos";

// Next no escapa las direcciones de las imágenes y las de Sanity traen "&" (?w=1800&auto=format), que rompe el XML.
const escaparXml = (url: string) => url.replace(/&/g, "&amp;");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propiedades, emprendimientos] = await Promise.all([getPropiedades(), getEmprendimientos()]);
  // Solo las combinaciones operación + tipo que tienen propiedades (ej. /venta/departamentos).
  const combinaciones = (Object.keys(rutasOperacion) as Operacion[]).flatMap((op) =>
    listaTipos
      .filter((t) => propiedades.some((p) => p.operaciones.some((o) => o.tipo === op) && esDelTipo(p.tipo, t.slug)))
      .map((t) => `${rutasOperacion[op]}/${t.slug}`),
  );
  const fijas = ["", "/venta", "/alquiler", "/alquiler-temporario", "/emprendimientos", "/propiedades", "/barrios", "/tasaciones", "/nosotros", "/contacto"];

  return [
    ...fijas.map((ruta) => ({
      url: `${site.url}${ruta}`,
      changeFrequency: "daily" as const,
      priority: ruta === "" ? 1 : 0.8,
    })),
    ...combinaciones.map((ruta) => ({ url: `${site.url}${ruta}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...listaBarrios.map((b) => ({
      url: `${site.url}/barrios/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...emprendimientos.map((e) => ({
      url: `${site.url}/emprendimientos/${e.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: e.fotos.slice(0, 1).map((f) => escaparXml(f.url)),
    })),
    ...propiedades.map((p) => ({
      url: `${site.url}/propiedades/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: p.fotos.slice(0, 1).map((f) => escaparXml(f.url)),
    })),
  ];
}
