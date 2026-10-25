import { defineField, defineType } from "sanity";

// Asesor de la oficina. Se muestra en el inicio y en Nosotros, ordenado por el campo "orden".
export const asesor = defineType({
  name: "asesor",
  title: "Asesor",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre y apellido", type: "string", validation: (r) => r.required() }),
    defineField({ name: "cargo", title: "Cargo", type: "string", initialValue: "Asesor inmobiliario" }),
    defineField({
      name: "foto",
      title: "Foto",
      description: "Cuadrada, con la cara centrada. Sirve la foto de perfil de Instagram.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "esLogo",
      title: "La foto es un logo",
      description: "Tildalo si en vez de una foto usa el logo de la inmobiliaria, así no se recorta.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "whatsapp", title: "WhatsApp", description: "Con característica, sin 0 ni 15. Ej.: 2234399282", type: "string" }),
    defineField({ name: "instagram", title: "Instagram", description: "Link del perfil o usuario.", type: "string" }),
    defineField({ name: "orden", title: "Orden", description: "1 aparece primero.", type: "number", initialValue: 10 }),
    defineField({
      name: "activo",
      title: "Mostrar en la web",
      description: "Destildalo cuando alguien deja la oficina, o borrá el asesor.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [{ title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] }],
  preview: {
    select: { title: "nombre", subtitle: "cargo", media: "foto", activo: "activo" },
    prepare: ({ title, subtitle, media, activo }) => ({ title: `${title ?? "Sin nombre"}${activo === false ? " (oculto)" : ""}`, subtitle, media }),
  },
});
