import { defineField, defineType } from "sanity";
import { listaBarrios } from "@/lib/barrios";
import { asesorACargo } from "./asesorACargo";
import { fotosYPlanos, videosYTours } from "./multimedia";

const tipos = ["Departamento", "Casa", "PH", "Local", "Oficina", "Terreno", "Galpón", "Campo", "Cochera"];

// Ficha de una propiedad cargada a mano desde /admin. Se muestra en la web junto con las de Tokko.
export const propiedad = defineType({
  name: "propiedad",
  title: "Propiedad",
  type: "document",
  groups: [
    { name: "datos", title: "Datos", default: true },
    { name: "multimedia", title: "Fotos, videos y tour" },
  ],
  fields: [
    defineField({ name: "publicada", title: "Publicada en la web", type: "boolean", initialValue: true, group: "datos" }),
    defineField({ name: "destacada", title: "Destacada en el inicio", type: "boolean", initialValue: false, group: "datos" }),
    asesorACargo,
    defineField({
      name: "titulo",
      title: "Título",
      description: "Ej.: 3 ambientes al frente con balcón",
      type: "string",
      validation: (r) => r.required().max(90),
      group: "datos",
    }),
    defineField({
      name: "operacion",
      title: "Operación",
      type: "string",
      options: {
        list: [
          { title: "Venta", value: "venta" },
          { title: "Alquiler", value: "alquiler" },
          { title: "Alquiler temporario", value: "temporario" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (r) => r.required(),
      group: "datos",
    }),
    defineField({ name: "tipo", title: "Tipo", type: "string", options: { list: tipos }, validation: (r) => r.required(), group: "datos" }),
    defineField({
      name: "direccion",
      title: "Dirección a mostrar",
      description: "Puede ser aproximada, ej.: Alberti al 1500",
      type: "string",
      validation: (r) => r.required(),
      group: "datos",
    }),
    defineField({
      name: "barrio",
      title: "Barrio",
      type: "string",
      options: { list: [...listaBarrios.map((b) => b.nombre), "Otro"] },
      validation: (r) => r.required(),
      group: "datos",
    }),
    defineField({
      name: "otroBarrio",
      title: "Nombre del barrio",
      type: "string",
      hidden: ({ document }) => document?.barrio !== "Otro",
      group: "datos",
    }),
    defineField({ name: "precio", title: "Precio", type: "number", group: "datos" }),
    defineField({
      name: "moneda",
      title: "Moneda",
      type: "string",
      options: { list: ["USD", "ARS"], layout: "radio", direction: "horizontal" },
      initialValue: "USD",
      group: "datos",
    }),
    defineField({ name: "mostrarPrecio", title: "Mostrar el precio en la web", type: "boolean", initialValue: true, group: "datos" }),
    defineField({ name: "ambientes", title: "Ambientes", type: "number", group: "datos" }),
    defineField({ name: "dormitorios", title: "Dormitorios", type: "number", group: "datos" }),
    defineField({ name: "banos", title: "Baños", type: "number", group: "datos" }),
    defineField({ name: "cocheras", title: "Cocheras", type: "number", group: "datos" }),
    defineField({ name: "superficieCubierta", title: "Superficie cubierta (m²)", type: "number", group: "datos" }),
    defineField({ name: "superficieTotal", title: "Superficie total (m²)", type: "number", group: "datos" }),
    defineField({ name: "codigo", title: "Código interno", type: "string", group: "datos" }),
    defineField({
      name: "emprendimiento",
      title: "Emprendimiento",
      description: "Si es una unidad de un edificio en pozo o en construcción, elegilo acá y aparece en su ficha.",
      type: "reference",
      to: [{ type: "emprendimiento" }],
      group: "datos",
    }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 10, group: "datos" }),
    defineField({
      name: "ubicacion",
      title: "Ubicación en el mapa",
      description: "Opcional. Si lo dejás vacío, el mapa ubica la dirección de arriba. Para un punto exacto, pegá el link largo de Google Maps (el que tiene @ y números).",
      type: "url",
      group: "datos",
    }),
    ...fotosYPlanos,
    defineField({
      name: "maqueta",
      title: "Maqueta 3D (archivo .html)",
      description: "La maqueta que arma Claude. Se muestra en la solapa Maqueta 3D; sus puntos 360° abren el tour de esta ficha.",
      type: "file",
      options: { accept: ".html,text/html" },
      group: "multimedia",
    }),
    ...videosYTours,
  ],
  preview: {
    select: { title: "direccion", subtitle: "titulo", media: "fotos.0", operacion: "operacion", publicada: "publicada", asesor: "asesor.nombre" },
    prepare: ({ title, subtitle, media, operacion, publicada, asesor }) => ({
      title: `${title ?? "Sin dirección"}${publicada === false ? " (oculta)" : ""}`,
      subtitle: [operacion, subtitle, asesor].filter(Boolean).join(" · "),
      media,
    }),
  },
});
