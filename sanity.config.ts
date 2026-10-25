"use client";

import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";
import { asesor } from "./src/sanity/asesor";
import { propiedad } from "./src/sanity/propiedad";

// Panel de carga de propiedades y asesores, disponible en /admin.
export default defineConfig({
  basePath: "/admin",
  title: "Goicoechea Propiedades",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  schema: { types: [propiedad, asesor] },
  plugins: [structureTool(), esESLocale()],
});
