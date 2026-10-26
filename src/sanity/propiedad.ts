import { defineArrayMember, defineField, defineType } from "sanity";
import { listaBarrios } from "@/lib/barrios";

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
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 10, group: "datos" }),
    defineField({
      name: "ubicacion",
      title: "Ubicación en el mapa",
      description: "Opcional. Si lo dejás vacío, el mapa ubica la dirección de arriba. Para un punto exacto, pegá el link largo de Google Maps (el que tiene @ y números).",
      type: "url",
      group: "datos",
    }),
    defineField({
      name: "fotos",
      title: "Fotos",
      description: "La primera es la portada. Podés arrastrarlas para cambiar el orden.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "descripcion", title: "Descripción breve", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
      group: "multimedia",
    }),
    defineField({
      name: "planos",
      title: "Planos",
      description: "Imagen del plano (JPG o PNG). Se muestra en su propia solapa en la ficha.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          fields: [defineField({ name: "descripcion", title: "Descripción breve", type: "string", description: "Ej.: Planta baja" })],
        }),
      ],
      group: "multimedia",
    }),
    defineField({
      name: "maqueta",
      title: "Maqueta 3D (archivo .html)",
      description: "La maqueta que arma Claude. Se muestra en la solapa Maqueta 3D; sus puntos 360° abren el tour de esta ficha.",
      type: "file",
      options: { accept: ".html,text/html" },
      group: "multimedia",
    }),
    defineField({
      name: "videos",
      title: "Videos (links)",
      description: "Links de YouTube o Vimeo.",
      type: "array",
      of: [defineArrayMember({ type: "url" })],
      group: "multimedia",
    }),
    defineField({
      name: "videosArchivo",
      title: "Videos (subir archivo)",
      description: "Archivos MP4 cortos. Para videos largos conviene YouTube.",
      type: "array",
      of: [defineArrayMember({ type: "file", options: { accept: "video/*" } })],
      group: "multimedia",
    }),
    defineField({
      name: "panoramas",
      title: "Tour virtual 360 (subir fotos 360)",
      description: "Fotos 360 (equirectangulares, 2:1) de cada ambiente. En la ficha se recorren una por una.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "ambiente", title: "Ambiente", type: "string", description: "Ej.: Living, Cocina, Dormitorio principal." }),
            defineField({ name: "imagen", title: "Foto 360", type: "image", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "ambiente", media: "imagen" } },
        }),
      ],
      group: "multimedia",
    }),
    defineField({
      name: "tours",
      title: "Tour virtual 360 (links)",
      description:
        "Link público de Matterport, Kuula u otro servicio de tours 360. Los links de Claude no se pueden mostrar dentro de la web: para esos tours subí las fotos 360 en el campo de arriba.",
      type: "array",
      of: [defineArrayMember({ type: "url" })],
      group: "multimedia",
    }),
  ],
  preview: {
    select: { title: "direccion", subtitle: "titulo", media: "fotos.0", operacion: "operacion", publicada: "publicada" },
    prepare: ({ title, subtitle, media, operacion, publicada }) => ({
      title: `${title ?? "Sin dirección"}${publicada === false ? " (oculta)" : ""}`,
      subtitle: [operacion, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
