import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Encabezado } from "@/components/Encabezado";
import { Migas } from "@/components/Migas";
import { SinPropiedades } from "@/components/SinPropiedades";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { buscarBarrio, listaBarrios } from "@/lib/barrios";
import { fotos } from "@/lib/fotos";
import { nombresOperacion, type Operacion } from "@/lib/propiedad";
import { getPropiedades } from "@/lib/propiedades";

export function generateStaticParams() {
  return listaBarrios.map((b) => ({ barrio: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/barrios/[barrio]">): Promise<Metadata> {
  const barrio = buscarBarrio((await params).barrio);
  if (!barrio) return {};
  return {
    title: `Propiedades en ${barrio.nombre}, Mar del Plata`,
    description: `Departamentos, casas y locales en venta y alquiler en ${barrio.nombre}, Mar del Plata. ${barrio.descripcion.split(". ")[0]}.`,
    alternates: { canonical: `/barrios/${barrio.slug}` },
  };
}

const orden: Operacion[] = ["venta", "alquiler", "temporario"];

export default async function PaginaBarrio({ params }: PageProps<"/barrios/[barrio]">) {
  const barrio = buscarBarrio((await params).barrio);
  if (!barrio) notFound();

  const propiedades = (await getPropiedades()).filter((p) => p.barrioSlug === barrio.slug);

  return (
    <>
      <Encabezado etiqueta="Barrio" titulo={`Propiedades en ${barrio.nombre}`} foto={fotos.ciudad}>
        <p>{barrio.descripcion}</p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas
          items={[
            { nombre: "Barrios", href: "/barrios" },
            { nombre: barrio.nombre, href: `/barrios/${barrio.slug}` },
          ]}
        />
        <div className="mt-10 space-y-20">
          {propiedades.length === 0 && (
            <SinPropiedades
              titulo={`Por ahora no hay propiedades publicadas en ${barrio.nombre}`}
              mensaje="Muchas propiedades entran antes de publicarse. Contanos qué buscás y te avisamos cuando aparezca algo."
            />
          )}
          {orden.map((op) => {
            const deEstaOperacion = propiedades.filter((p) => p.operaciones.some((o) => o.tipo === op));
            if (deEstaOperacion.length === 0) return null;
            return (
              <div key={op}>
                <h2 className="mb-8 font-serif text-3xl font-bold">
                  {nombresOperacion[op]} en {barrio.nombre}
                </h2>
                <GrillaPropiedades propiedades={deEstaOperacion} />
              </div>
            );
          })}
        </div>
      </section>
      <section className="border-t border-borde bg-fondo">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-serif text-2xl font-bold">Otros barrios</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {listaBarrios
              .filter((b) => b.slug !== barrio.slug)
              .map((b) => (
                <li key={b.slug}>
                  <Link href={`/barrios/${b.slug}`} className="underline-offset-4 hover:underline">
                    {b.nombre}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
