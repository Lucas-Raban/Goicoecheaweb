// En el plan gratis de Sanity todos los que cargan propiedades son administradores.
// Dentro del panel, borrar fichas y manejar asesores queda solo para estos emails.
const administradores = ["goicoecheapropiedades@gmail.com", "lucasraban.lr@gmail.com"];

export function esAdministrador(email?: string | null) {
  return Boolean(email && administradores.includes(email.toLowerCase()));
}
