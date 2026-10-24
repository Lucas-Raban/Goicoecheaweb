import Image from "next/image";
import { equipo } from "@/lib/site";

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

// Las fotos de perfil de Instagram son chicas (320 px), por eso van en círculo y a tamaño moderado.
export function Equipo() {
  return (
    <div className="grid gap-px border border-borde bg-borde sm:grid-cols-2 lg:grid-cols-3">
      {equipo.map((a) => (
        <div key={a.nombre} className="flex items-center gap-6 bg-white p-6 md:p-8">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-fondo md:h-28 md:w-28">
            {a.foto ? (
              <Image src={a.foto} alt={a.nombre} fill sizes="112px" className="object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-bold text-gris">
                {iniciales(a.nombre)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-2xl leading-tight font-bold">{a.nombre}</h3>
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
              {a.instagram && (
                <a
                  href={`https://www.instagram.com/${a.instagram}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-azul pb-0.5"
                >
                  @{a.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
