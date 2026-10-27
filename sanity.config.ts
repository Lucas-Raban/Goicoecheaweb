"use client";

import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";
import { asesor } from "./src/sanity/asesor";
import { emprendimiento } from "./src/sanity/emprendimiento";
import { esAdministrador } from "./src/sanity/permisos";
import { propiedad } from "./src/sanity/propiedad";

// Panel de carga de propiedades, emprendimientos y asesores, disponible en /admin.
export default defineConfig({
  basePath: "/admin",
  title: "Goicoechea Propiedades",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  schema: { types: [propiedad, emprendimiento, asesor] },
  plugins: [structureTool(), esESLocale()],
  document: {
    // Los asesores cargan y editan; borrar, despublicar y manejar asesores es solo de los administradores.
    actions: (anteriores, { schemaType, currentUser }) => {
      if (esAdministrador(currentUser?.email)) return anteriores;
      if (schemaType === "asesor") return [];
      return anteriores.filter((a) => a.action !== "delete" && a.action !== "unpublish");
    },
    newDocumentOptions: (anteriores, { currentUser }) =>
      esAdministrador(currentUser?.email) ? anteriores : anteriores.filter((t) => t.templateId !== "asesor"),
  },
});
