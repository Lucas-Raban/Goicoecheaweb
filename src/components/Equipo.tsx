import Image from "next/image";
import { equipo } from "@/lib/site";

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export function Equipo() {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {equipo.map((a) => (
        <div key={a.nombre}>
          <div className="relative aspect-[4/5] overflow-hidden bg-fondo">
            {a.foto ? (
              <Image src={a.foto} alt={a.nombre} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-serif text-7xl font-bold text-borde">
                {iniciales(a.nombre)}
              </span>
            )}
          </div>
          <h3 className="mt-5 font-serif text-2xl font-bold">{a.nombre}</h3>
          <p className="mt-1 text-gris">{a.cargo}</p>
          {a.whatsapp && (
            <a
              href={`https://wa.me/${a.whatsapp}?text=${encodeURIComponent(`Hola ${a.nombre.split(" ")[0]}, te escribo desde la web.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border-b border-azul pb-1 text-sm font-bold"
            >
              Escribirle por WhatsApp
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
