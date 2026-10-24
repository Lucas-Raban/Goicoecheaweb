import type { MetadataRoute } from "next";
import { listaBarrios } from "@/lib/barrios";
import { site } from "@/lib/site";
import { getPropiedades } from "@/lib/tokko";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propiedades = await getPropiedades();
  const fijas = ["", "/venta", "/alquiler", "/alquiler-temporario", "/propiedades", "/barrios", "/tasaciones", "/nosotros", "/contacto"];

  return [
    ...fijas.map((ruta) => ({
      url: `${site.url}${ruta}`,
      changeFrequency: "daily" as const,
      priority: ruta === "" ? 1 : 0.8,
    })),
    ...listaBarrios.map((b) => ({
      url: `${site.url}/barrios/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...propiedades.map((p) => ({
      url: `${site.url}/propiedades/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: p.fotos.slice(0, 1).map((f) => f.url),
    })),
  ];
}
