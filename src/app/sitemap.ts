import type { MetadataRoute } from "next";
import { navegacion, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...navegacion.map((item) => ({
      url: `${site.url}${item.href}`,
      changeFrequency: "weekly" as const,
      priority: item.href === "/propiedades" ? 0.9 : 0.6,
    })),
  ];
}
