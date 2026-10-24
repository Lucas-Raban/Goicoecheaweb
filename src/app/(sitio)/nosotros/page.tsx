import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { Equipo } from "@/components/Equipo";
import { fotos } from "@/lib/fotos";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Goicoechea Propiedades, inmobiliaria en Alberti 1550, Mar del Plata. Honestidad, trato personalizado y cientos de operaciones concretadas.",
  alternates: { canonical: "/nosotros" },
};


export default function Nosotros() {
  return (
    <>
      <Encabezado etiqueta="Nosotros" titulo="Una inmobiliaria de Mar del Plata" foto={fotos.ciudad} />

      <section className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 py-20 md:grid-cols-[2fr_1fr]">
        <div className="space-y-5 text-lg text-gris">
          <p>
            Goicoechea Propiedades es una inmobiliaria de Mar del Plata con cientos de operaciones concretadas. Trabajamos
            en venta, alquiler, alquiler temporario y tasaciones de departamentos, casas, locales, terrenos, galpones y
            campos.
          </p>
          <p>
            Nos importa que entiendas cada paso. Te decimos lo que vale tu propiedad, la mostramos con fotos y videos
            reales, y te acompañamos hasta la firma, sea una escritura o un contrato de alquiler.
          </p>
        </div>

        <aside className="border-l-2 border-azul pl-6">
          <h2 className="font-serif text-xl font-bold">Oficina</h2>
          <p className="mt-3 text-gris">
            {site.direccion.calle}
            <br />
            {site.direccion.ciudad}
          </p>
          <p className="mt-4">
            <a href={linkWhatsapp()} className="font-bold underline">
              {site.telefono}
            </a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${site.email}`} className="break-all text-gris underline">
              {site.email}
            </a>
          </p>
          <p className="mt-4 text-sm text-gris">{site.registro}</p>
        </aside>
      </section>

      <section className="border-t border-borde">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="mb-12 font-serif text-3xl font-bold md:text-4xl">El equipo</h2>
          <Equipo />
        </div>
      </section>
    </>
  );
}
