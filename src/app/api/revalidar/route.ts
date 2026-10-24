import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity llama a esta ruta cada vez que se publica o borra una propiedad, para que la web se actualice al instante.
export async function POST(req: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) return new Response("Falta SANITY_REVALIDATE_SECRET", { status: 500 });

  const { isValidSignature } = await parseBody(req, secreto);
  if (!isValidSignature) return new Response("Firma inválida", { status: 401 });

  revalidateTag("propiedades", "max");
  return Response.json({ ok: true });
}
