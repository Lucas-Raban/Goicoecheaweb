"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cumple, describirFiltros, leerFiltros } from "@/lib/filtros";
import type { Propiedad } from "@/lib/propiedad";
import { Buscador } from "./Buscador";
import { GrillaPropiedades } from "./TarjetaPropiedad";
import { SinPropiedades } from "./SinPropiedades";

// Filtra en el navegador según lo elegido en el buscador (operación, tipo, barrio, ambientes, precio...).
export function ListadoFiltrable({ propiedades }: { propiedades: Propiedad[] }) {
  const params = useSearchParams();
  const filtros = leerFiltros(params);
  const filtradas = propiedades.filter((p) => cumple(p, filtros));
  const resumen = describirFiltros(filtros);

  return (
    <>
      <div className="mb-10">
        <Buscador key={params.toString()} inicial={filtros} />
      </div>
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-borde pb-4">
        <p className="text-gris">
          {filtradas.length} {filtradas.length === 1 ? "propiedad" : "propiedades"}
          {resumen.length > 0 && <> · {resumen.join(", ")}</>}
        </p>
        {resumen.length > 0 && (
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
          mensaje="Probá sacando algún filtro o ampliando el precio, o escribinos: muchas propiedades entran antes de publicarse."
        />
      )}
    </>
  );
}
