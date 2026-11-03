import Image from "next/image";
import Link from "next/link";
import type { Emprendimiento } from "@/lib/emprendimiento";

export function TarjetaEmprendimiento({ e, unidades, prioridad }: { e: Emprendimiento; unidades: number; prioridad?: boolean }) {
  return (
    <Link href={`/emprendimientos/${e.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-fondo">
        {e.fotos[0] && (
          <Image
            unoptimized
            src={e.fotos[0].url}
            alt={`${e.nombre}, ${e.barrio}`}
            fill
            priority={prioridad}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <span className="etiqueta absolute top-0 left-0 bg-white px-3 py-2 text-azul">{e.estado ?? "Emprendimiento"}</span>
      </div>
      <p className="mt-4 text-sm text-gris">
        {e.barrio} · {e.direccion}
      </p>
      <h3 className="mt-1 font-titulo text-xl leading-snug font-bold group-hover:underline">{e.nombre}</h3>
      <p className="mt-2 text-sm text-gris">
        {[e.entrega && `Entrega ${e.entrega}`, unidades > 0 && `${unidades} ${unidades === 1 ? "unidad disponible" : "unidades disponibles"}`]
          .filter(Boolean)
          .join(" · ") || "Consultá unidades y precios"}
      </p>
      {e.precioDesde && <p className="mt-3 font-bold">Desde {e.precioDesde}</p>}
    </Link>
  );
}
