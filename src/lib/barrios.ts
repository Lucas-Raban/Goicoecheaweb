import { slugify } from "./texto";

export type Barrio = { nombre: string; slug: string; descripcion: string };

// Textos para revisar con Lucas: describen cada zona para las páginas por barrio.
const datos: Array<Omit<Barrio, "slug">> = [
  {
    nombre: "Centro",
    descripcion:
      "El centro de Mar del Plata concentra comercios, bancos, oficinas y el movimiento de todo el año. Es la zona con más oferta de departamentos, desde monoambientes hasta pisos grandes, y de locales comerciales.",
  },
  {
    nombre: "Plaza Mitre",
    descripcion:
      "Alrededor de Plaza Mitre hay edificios de departamentos amplios, muchos con vista a la plaza, a pocas cuadras del centro y de la costa. Es una zona tranquila y muy buscada para vivir todo el año.",
  },
  {
    nombre: "Chauvin",
    descripcion:
      "Chauvin es un barrio residencial cerca del centro y de la costa, con edificios de departamentos, casas y PH. Tiene buena oferta de comercios y servicios en sus calles principales.",
  },
  {
    nombre: "La Perla",
    descripcion:
      "La Perla está al norte del centro, sobre la costa. Combina departamentos frente al mar, casas y PH, y es una zona elegida tanto para vivir como para alquilar en temporada.",
  },
  {
    nombre: "Güemes",
    descripcion:
      "Güemes es conocido por su paseo comercial sobre la calle Güemes, con locales de ropa, cafés y restaurantes. Hay departamentos, PH y casas, y es una buena zona para locales.",
  },
  {
    nombre: "Playa Grande",
    descripcion:
      "Playa Grande está junto a una de las playas más conocidas de la ciudad. Tiene departamentos de categoría, muchos con vista al mar, y casas en las calles internas.",
  },
  {
    nombre: "Los Troncos",
    descripcion:
      "Los Troncos es un barrio residencial de casas y chalets con jardín, calles arboladas y poco tránsito, cerca de la costa sur.",
  },
  {
    nombre: "Stella Maris",
    descripcion:
      "Stella Maris es una zona residencial en altura, cerca de la costa y de Playa Grande, con departamentos y casas en calles tranquilas.",
  },
  {
    nombre: "Sierra de los Padres",
    descripcion:
      "Sierra de los Padres está a pocos kilómetros de la ciudad, entre sierras y arboledas. Ofrece casas y lotes amplios para quienes buscan verde y tranquilidad.",
  },
  {
    nombre: "Batán",
    descripcion:
      "Batán es una localidad del partido de General Pueyrredon, al oeste de la ciudad, con lotes, casas y propiedades de uso productivo.",
  },
];

export const listaBarrios: Barrio[] = datos.map((b) => ({ ...b, slug: slugify(b.nombre) }));

export function buscarBarrio(slug: string) {
  return listaBarrios.find((b) => b.slug === slug);
}
