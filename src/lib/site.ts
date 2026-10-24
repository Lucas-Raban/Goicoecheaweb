import { listaBarrios } from "./barrios";

export const site = {
  nombre: "Goicoechea Propiedades",
  registro: "Reg. 3594",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://goicoecheapropiedades.com",
  // Mientras la web nueva esté en prueba no la indexamos, para no competir con la actual.
  indexar: process.env.NEXT_PUBLIC_INDEXAR === "true",
  descripcion:
    "Inmobiliaria en Mar del Plata. Venta, alquiler y alquiler temporario de departamentos, casas, locales y terrenos. Pedí tu tasación.",
  direccion: {
    calle: "Alberti 1550, local 1",
    ciudad: "Mar del Plata",
    provincia: "Buenos Aires",
    codigoPais: "AR",
  },
  telefono: "+54 9 223 511-1816",
  whatsapp: "5492235111816",
  email: "goicoecheapropiedades@gmail.com",
  redes: {
    instagram: "https://www.instagram.com/goicoecheapropiedades/",
    facebook: "https://www.facebook.com/people/Goicoechea-Propiedades/100010540184939/",
  },
  // Web actual en Tokko, hasta que el catálogo se lea desde la API.
  catalogoActual: "https://goicoecheapropiedades.com",
};

// Asesores de la oficina. La foto de perfil se guarda en public/equipo/ (cuadrada); sin foto se ven las iniciales.
export const equipo: { nombre: string; cargo: string; whatsapp?: string; instagram?: string; foto?: string; esLogo?: boolean }[] = [
  {
    nombre: "Lucas Raban",
    cargo: "Asesor inmobiliario",
    whatsapp: "5492234399282",
    instagram: "https://www.instagram.com/lucasraban.propiedades/",
    foto: "/equipo/lucas-raban.jpg",
  },
  {
    nombre: "Nicolas Loinas",
    cargo: "Asesor inmobiliario",
    whatsapp: "5492236164513",
    instagram: "https://www.instagram.com/loinas.propiedades/",
    // Su perfil de Instagram usa el isotipo de la inmobiliaria.
    foto: "/marca/isotipo-azul.png",
    esLogo: true,
  },
  {
    nombre: "Alejandro Cordeiro",
    cargo: "Asesor inmobiliario",
    whatsapp: "5492234541702",
    instagram: "https://www.instagram.com/alebkomc/",
    foto: "/equipo/alejandro-cordeiro.jpg",
  },
];

export const navegacion = [
  { href: "/venta", label: "Venta" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/alquiler-temporario", label: "Temporario" },
  { href: "/tasaciones", label: "Tasaciones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export const barrios = listaBarrios.map((b) => b.nombre);

export const avisoLegal =
  "Todas las medidas enunciadas son meramente orientativas, las medidas exactas serán las que se expresen en el respectivo título de propiedad de cada inmueble. Todas las fotos, imágenes y videos son meramente ilustrativos y no contractuales. Los precios enunciados son meramente orientativos y no contractuales.";

export function linkWhatsapp(mensaje?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
