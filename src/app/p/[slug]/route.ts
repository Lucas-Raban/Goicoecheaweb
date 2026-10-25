import { getPropiedades } from "@/lib/propiedades";

// Fichas de la web anterior: /p/4762187-Departamento-en-Venta-en-Chauvin. El número es el ID de Tokko,
// el mismo que usa la ficha nueva, así que se redirige con 301 a su nueva dirección.
export async function GET(request: Request, { params }: RouteContext<"/p/[slug]">) {
  const id = (await params).slug.match(/^\d+/)?.[0];
  const propiedad = id ? (await getPropiedades()).find((p) => p.id === `tokko-${id}`) : undefined;
  const destino = propiedad ? `/propiedades/${propiedad.slug}` : "/propiedades";
  return Response.redirect(new URL(destino, request.url), 301);
}
