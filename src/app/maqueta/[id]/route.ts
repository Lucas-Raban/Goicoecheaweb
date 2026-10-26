import { adaptarMaqueta } from "@/lib/maqueta";
import { getMaquetaUrl } from "@/lib/sanity";

// Sirve la maqueta 3D subida en el panel. Va con sandbox: corre aislada de la web aunque se abra directo.
export async function GET(_request: Request, { params }: RouteContext<"/maqueta/[id]">) {
  const url = await getMaquetaUrl((await params).id);
  if (!url) return new Response("Maqueta no encontrada", { status: 404 });
  const respuesta = await fetch(url);
  if (!respuesta.ok) return new Response("Maqueta no disponible", { status: 502 });
  return new Response(adaptarMaqueta(await respuesta.text()), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox",
      "cache-control": "public, max-age=300",
    },
  });
}
