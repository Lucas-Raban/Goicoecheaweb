import type { Metadata } from "next";
import Link from "next/link";
import { Encabezado } from "@/components/Encabezado";
import { Migas } from "@/components/Migas";
import { listaBarrios } from "@/lib/barrios";
import { fotos } from "@/lib/fotos";

export const metadata: Metadata = {
  title: "Barrios de Mar del Plata",
  description: "Propiedades en venta y alquiler por barrio en Mar del Plata: Centro, Plaza Mitre, Chauvin, La Perla, Güemes, Playa Grande y más.",
  alternates: { canonical: "/barrios" },
};

export default function Barrios() {
  return (
    <>
      <Encabezado etiqueta="Barrios" titulo="Barrios de Mar del Plata" foto={fotos.hero}>
        <p>Cómo es cada zona y qué propiedades tenemos en cada una.</p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas items={[{ nombre: "Barrios", href: "/barrios" }]} />
        <ul className="mt-10 grid gap-x-10 border-t border-borde md:grid-cols-2">
          {listaBarrios.map((b) => (
            <li key={b.slug} className="border-b border-borde py-8">
              <Link href={`/barrios/${b.slug}`} className="group block">
                <h2 className="font-titulo text-3xl font-bold group-hover:underline">{b.nombre}</h2>
                <p className="mt-3 text-gris">{b.descripcion}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
