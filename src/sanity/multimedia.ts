import { defineArrayMember, defineField } from "sanity";

// Campos de fotos, planos, videos y tour 360, compartidos entre propiedades y emprendimientos.
export const fotosYPlanos = [
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
];

export const videosYTours = [
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
];
