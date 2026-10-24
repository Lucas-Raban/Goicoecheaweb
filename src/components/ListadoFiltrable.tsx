"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { slugify } from "@/lib/texto";
import type { Propiedad } from "@/lib/propiedad";
import { GrillaPropiedades } from "./TarjetaPropiedad";
import { SinPropiedades } from "./SinPropiedades";

// Filtra en el navegador según lo elegido en el buscador (operación, tipo y barrio).
export function ListadoFiltrable({ propiedades }: { propiedades: Propiedad[] }) {
  const params = useSearchParams();
  const operacion = params.get("operacion");
  const tipo = params.get("tipo");
  const barrio = params.get("barrio");

  const filtradas = propiedades.filter(
    (p) =>
      (!operacion || p.operaciones.some((o) => o.tipo === operacion)) &&
      (!tipo || slugify(p.tipo) === slugify(tipo)) &&
      (!barrio || p.barrioSlug === slugify(barrio)),
  );

  const filtros = [operacion, tipo, barrio].filter(Boolean);

  return (
    <>
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-borde pb-4">
        <p className="text-gris">
          {filtradas.length} {filtradas.length === 1 ? "propiedad" : "propiedades"}
          {filtros.length > 0 && <> · filtro: {filtros.join(", ")}</>}
        </p>
        {filtros.length > 0 && (
          <Link href="/propiedades" className="text-sm font-bold underline">
            Ver todas
          </Link>
        )}
      </div>
      {filtradas.length > 0 ? (
        <GrillaPropiedades propiedades={filtradas} />
      ) : (
        <SinPropiedades
          titulo="No encontramos propiedades con esos filtros"
          mensaje="Probá con otro barrio o tipo, o escribinos: muchas propiedades entran antes de publicarse."
        />
      )}
    </>
  );
}
