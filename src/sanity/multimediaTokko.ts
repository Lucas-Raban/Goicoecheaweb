import { defineField, defineType } from "sanity";
import { fotosYPlanos, videosYTours } from "./multimedia";

// Tour 360, maqueta, planos y videos extra para una propiedad que viene de Tokko.
// Tokko no tiene dónde guardar fotos 360: se cargan acá y la web los suma a la ficha de esa propiedad.
export const multimediaTokko = defineType({
  name: "multimediaTokko",
  title: "Tour 360 de propiedad de Tokko",
  type: "document",
  groups: [
    { name: "datos", title: "Propiedad", default: true },
    { name: "multimedia", title: "Fotos 360, maqueta y planos" },
  ],
  fields: [
    defineField({
      name: "codigo",
      title: "Código de la propiedad en Tokko",
      description: "El código que figura en la ficha de la web (ej.: 561153). También podés pegar el link de la ficha.",
      type: "string",
      validation: (r) => r.required(),
      group: "datos",
    }),
    defineField({
      name: "direccion",
      title: "Dirección (solo para reconocerla en el panel)",
      description: "Ej.: Corrientes 3130",
      type: "string",
      group: "datos",
    }),
    defineField({
      name: "maqueta",
      title: "Maqueta 3D (archivo .html)",
      description: "La maqueta que arma Claude. Sus puntos 360° abren las fotos 360 en el mismo orden en que están cargadas acá.",
      type: "file",
      options: { accept: ".html,text/html" },
      group: "multimedia",
    }),
    ...fotosYPlanos.filter((f) => f.name === "planos"),
    ...videosYTours,
  ],
  preview: {
    select: { title: "direccion", codigo: "codigo", media: "panoramas.0.imagen" },
    prepare: ({ title, codigo, media }) => ({ title: title || `Código ${codigo ?? "?"}`, subtitle: `Tokko · código ${codigo ?? "?"}`, media }),
  },
});
