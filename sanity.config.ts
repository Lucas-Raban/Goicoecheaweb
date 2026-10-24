"use client";

import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";
import { propiedad } from "./src/sanity/propiedad";

// Panel de carga de propiedades, disponible en /admin.
export default defineConfig({
  basePath: "/admin",
  title: "Goicoechea Propiedades",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  schema: { types: [propiedad] },
  plugins: [structureTool(), esESLocale()],
});
