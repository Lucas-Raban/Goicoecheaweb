import type { Metadata } from "next";
import { Suspense } from "react";
import { Encabezado } from "@/components/Encabezado";
import { ListadoFiltrable } from "@/components/ListadoFiltrable";
import { Migas } from "@/components/Migas";
import { SinPropiedades } from "@/components/SinPropiedades";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { fotos } from "@/lib/fotos";
import { getPropiedades } from "@/lib/tokko";

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler en Mar del Plata",
  description:
    "Departamentos, casas, locales y terrenos en venta, alquiler y alquiler temporario en Mar del Plata. Fotos, videos y recorridos 360.",
  alternates: { canonical: "/propiedades" },
};

export default async function Propiedades() {
  const propiedades = await getPropiedades();

  return (
    <>
      <Encabezado etiqueta="Propiedades" titulo="Propiedades en Mar del Plata" foto={fotos.venta}>
        <p>Venta, alquiler y alquiler temporario de departamentos, casas, locales y terrenos.</p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas items={[{ nombre: "Propiedades", href: "/propiedades" }]} />
        <div className="mt-10">
          {propiedades.length > 0 ? (
            <Suspense fallback={<GrillaPropiedades propiedades={propiedades} />}>
              <ListadoFiltrable propiedades={propiedades} />
            </Suspense>
          ) : (
            <SinPropiedades
              titulo="Estamos sumando el catálogo a la web nueva"
              mensaje="Muy pronto vas a poder buscar por operación, barrio y tipo, con fotos, videos y recorridos 360. Mientras tanto, escribinos o mirá el catálogo en nuestra web actual."
            />
          )}
        </div>
      </section>
    </>
  );
}
