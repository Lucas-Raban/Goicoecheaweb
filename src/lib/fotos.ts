// Fotos de Mar del Plata de Unsplash (licencia libre, sin atribución obligatoria).
// Reemplazar por fotos y videos propios cuando estén.
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=70`;

export const fotos = {
  // Vista aérea de la costa, Maximiliano Deliso
  hero: unsplash("photo-1724112761998-aca1531c2414"),
  // Playa Varese desde el aire, Fermin Rodriguez Penelas
  venta: unsplash("photo-1561816646-b5b12a9b92ed"),
  // Edificios frente a Playa Varese, Fermin Rodriguez Penelas
  alquiler: unsplash("photo-1561816544-21ecbffa09a3"),
  // Costa de Playa Varese, Fermin Rodriguez Penelas
  temporario: unsplash("photo-1561815907-c39c3c1c7f49"),
  // Pescador con la ciudad de fondo, Thomas Adamo Salvo
  ciudad: unsplash("photo-1726147030248-080f85d3cb82"),
};
