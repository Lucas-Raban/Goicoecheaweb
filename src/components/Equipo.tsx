import { getAsesoresPanel } from "@/lib/sanity";
import { equipo } from "@/lib/site";
import { FotoPerfil } from "./FotoPerfil";

// Acepta el link completo del perfil o solo el usuario.
function usuarioInstagram(valor?: string) {
  if (!valor) return undefined;
  return (
    valor
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/[/?#].*$/, "")
      .replace(/^@/, "") || undefined
  );
}

// Las fotos de perfil de Instagram son chicas (320 px), por eso van en círculo y a tamaño moderado.
// Usa los asesores del panel; si todavía no hay ninguno publicado, los de respaldo de site.ts.
export async function Equipo() {
  const panel = await getAsesoresPanel();
  const asesores = panel.length > 0 ? panel : equipo;
  return (
    <div className="grid gap-px border border-borde bg-borde sm:grid-cols-2 lg:grid-cols-3">
      {asesores.map((a) => {
        const usuario = usuarioInstagram(a.instagram);
        return (
          <div key={a.nombre} className="flex items-center gap-6 bg-white p-6 md:p-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-fondo md:h-28 md:w-28">
              <FotoPerfil foto={a.foto} nombre={a.nombre} esLogo={a.esLogo} />
            </div>
            <div className="min-w-0">
              <h3 className="font-titulo text-2xl leading-tight font-bold">{a.nombre}</h3>
              <p className="mt-1 text-sm text-gris">{a.cargo}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                {a.whatsapp && (
                  <a
                    href={`https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Hola ${a.nombre.split(" ")[0]}, te escribo desde la web.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-azul pb-0.5"
                  >
                    WhatsApp
                  </a>
                )}
                {usuario && (
                  <a
                    href={`https://www.instagram.com/${usuario}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-azul pb-0.5"
                  >
                    @{usuario}
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
