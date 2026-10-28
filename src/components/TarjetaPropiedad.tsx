import Image from "next/image";
import Link from "next/link";
import { nombresOperacion, type Propiedad } from "@/lib/propiedad";

export function datosCortos(p: Propiedad) {
  return [
    p.ambientes && `${p.ambientes} amb.`,
    p.dormitorios && `${p.dormitorios} dorm.`,
    p.banos && `${p.banos} baño${p.banos > 1 ? "s" : ""}`,
    (p.superficieCubierta ?? p.superficieTotal) && `${p.superficieCubierta ?? p.superficieTotal} m²`,
  ].filter(Boolean) as string[];
}

export function TarjetaPropiedad({ propiedad: p, prioridad }: { propiedad: Propiedad; prioridad?: boolean }) {
  const op = p.operaciones[0];
  return (
    <Link href={`/propiedades/${p.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-fondo">
        {p.fotos[0] && (
          <Image
            unoptimized
            src={p.fotos[0].url}
            alt={`${p.tipo} en ${p.barrio}`}
            fill
            priority={prioridad}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {op && (
          <span className="etiqueta absolute top-0 left-0 bg-white px-3 py-2 text-azul">
            {nombresOperacion[op.tipo]}: {p.tipo}
          </span>
        )}
        {(p.videos.length > 0 || p.videosArchivo.length > 0 || p.tours.length > 0 || p.panoramas.length > 0 || p.maqueta) && (
          <span className="absolute right-3 bottom-3 bg-azul/85 px-2.5 py-1 text-xs font-bold text-white">
            {[(p.videos.length > 0 || p.videosArchivo.length > 0) && "Video", (p.tours.length > 0 || p.panoramas.length > 0) && "Tour 360", p.maqueta && "3D"].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-gris">{p.barrio}</p>
      <h3 className="mt-1 font-serif text-xl leading-snug font-bold group-hover:underline">{p.direccion}</h3>
      <p className="mt-2 text-sm text-gris">{datosCortos(p).join(" · ")}</p>
      <p className="mt-3 font-bold">{op?.precio ?? "Consultar precio"}</p>
    </Link>
  );
}

export function GrillaPropiedades({ propiedades }: { propiedades: Propiedad[] }) {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {propiedades.map((p, i) => (
        <TarjetaPropiedad key={p.id} propiedad={p} prioridad={i < 3} />
      ))}
    </div>
  );
}
