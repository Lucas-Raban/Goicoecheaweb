import { defineArrayMember, defineField, defineType } from "sanity";
import { listaBarrios } from "@/lib/barrios";
import { fotosYPlanos, videosYTours } from "./multimedia";

// Edificio en pozo o en construcción cargado a mano en /admin. Se muestra en /emprendimientos junto con los de Tokko.
// Las unidades se cargan como propiedades y se vinculan desde el campo "Emprendimiento" de cada una.
export const emprendimiento = defineType({
  name: "emprendimiento",
  title: "Emprendimiento",
  type: "document",
  groups: [
    { name: "datos", title: "Datos", default: true },
    { name: "multimedia", title: "Fotos, videos y tour" },
  ],
  fields: [
    defineField({ name: "publicado", title: "Publicado en la web", type: "boolean", initialValue: true, group: "datos" }),
    defineField({ name: "destacado", title: "Destacado (aparece primero)", type: "boolean", initialValue: false, group: "datos" }),
    defineField({
      name: "nombre",
      title: "Nombre",
      description: "Ej.: Edificio Alberti 2200",
      type: "string",
      validation: (r) => r.required().max(80),
      group: "datos",
    }),
    defineField({
      name: "estado",
      title: "Estado de obra",
      type: "string",
      options: { list: ["En pozo", "En construcción", "Terminado"], layout: "radio", direction: "horizontal" },
      initialValue: "En pozo",
      group: "datos",
    }),
    defineField({ name: "entrega", title: "Entrega estimada", description: "Ej.: Diciembre 2027", type: "string", group: "datos" }),
    defineField({
      name: "direccion",
      title: "Dirección a mostrar",
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
    defineField({ name: "precioDesde", title: "Precio desde", description: "Valor de la unidad más barata. Opcional.", type: "number", group: "datos" }),
    defineField({
      name: "moneda",
      title: "Moneda",
      type: "string",
      options: { list: ["USD", "ARS"], layout: "radio", direction: "horizontal" },
      initialValue: "USD",
      group: "datos",
    }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 10, group: "datos" }),
    defineField({
      name: "amenities",
      title: "Amenities y características",
      description: "Escribí una y apretá Enter. Ej.: Pileta, SUM, Cocheras, Laundry.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      group: "datos",
    }),
    defineField({
      name: "financiacion",
      title: "Financiación y formas de pago",
      description: "Ej.: 40% de anticipo y 30 cuotas en pesos ajustadas por CAC.",
      type: "text",
      rows: 4,
      group: "datos",
    }),
    defineField({
      name: "ubicacion",
      title: "Ubicación en el mapa",
      description: "Opcional. Si lo dejás vacío, el mapa ubica la dirección de arriba. Para un punto exacto, pegá el link largo de Google Maps (el que tiene @ y números).",
      type: "url",
      group: "datos",
    }),
    ...fotosYPlanos,
    ...videosYTours,
  ],
  preview: {
    select: { title: "nombre", subtitle: "direccion", media: "fotos.0", estado: "estado", publicado: "publicado" },
    prepare: ({ title, subtitle, media, estado, publicado }) => ({
      title: `${title ?? "Sin nombre"}${publicado === false ? " (oculto)" : ""}`,
      subtitle: [estado, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
