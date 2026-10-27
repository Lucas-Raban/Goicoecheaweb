import { defineField, type InitialValueResolver, type Reference } from "sanity";
import { sanityApiVersion } from "./env";

// Asesor responsable de la publicación. Al crear una ficha se completa solo con quien está logueado,
// si su email figura en su ficha de Asesor. Solo se pueden elegir asesores activos.
export const asesorACargo = defineField({
  name: "asesor",
  title: "Asesor a cargo",
  description: "Las consultas de esta ficha le llegan a su WhatsApp. Si lo dejás vacío, o si el asesor se da de baja, van al de la inmobiliaria.",
  type: "reference",
  to: [{ type: "asesor" }],
  options: { filter: "activo != false" },
  // Los tipos de Sanity no contemplan devolver undefined (campo vacío), aunque funciona.
  initialValue: (async (_params, { currentUser, getClient }) => {
    if (!currentUser?.email) return undefined;
    const id = await getClient({ apiVersion: sanityApiVersion }).fetch<string | null>(
      `*[_type == "asesor" && activo != false && lower(email) == lower($email) && !(_id in path("drafts.**"))][0]._id`,
      { email: currentUser.email },
    );
    return id ? { _type: "reference", _ref: id } : undefined;
  }) as InitialValueResolver<unknown, Omit<Reference, "_type">>,
  group: "datos",
});
