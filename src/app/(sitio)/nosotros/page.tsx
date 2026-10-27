import type { Metadata } from "next";
import Link from "next/link";
import { Encabezado } from "@/components/Encabezado";
import { Equipo } from "@/components/Equipo";
import { fotos } from "@/lib/fotos";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Goicoechea Propiedades, inmobiliaria en Alberti 1550, Mar del Plata. Más de 10 años de trayectoria y cientos de operaciones exitosas en compra, venta y alquiler.",
  alternates: { canonical: "/nosotros" },
};


export default function Nosotros() {
  return (
    <>
      <Encabezado etiqueta="Nosotros" titulo="Goicoechea Propiedades: Innovación, Confianza y Trayectoria Inmobiliaria" foto={fotos.ciudad} />

      <section className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 py-20 md:grid-cols-[2fr_1fr]">
        <div className="space-y-5 text-lg text-gris">
          <p>
            En Goicoechea Propiedades combinamos la solidez de más de 10 años de trayectoria con la innovación constante
            del Real Estate moderno. Nos guían la honestidad, la ética y la búsqueda de la excelencia en cada operación.
          </p>
          <p>
            Contamos con un equipo de profesionales altamente capacitados y en constante formación, enfocado en ofrecer
            soluciones personalizadas y estratégicas para la compra, venta o alquiler de propiedades.
          </p>
          <p>
            Impulsamos nuestro servicio, automatización de procesos y marketing de vanguardia, garantizando una
            comunicación al instante, análisis de mercado precisos y gestiones en tiempo real. Todo esto, manteniendo
            siempre la calidez y el trato exclusivo de siempre.
          </p>
          <p>
            Con cientos de operaciones exitosas que nos avalan, hacemos que tu experiencia inmobiliaria sea simple,
            transparente y eficiente.
          </p>
          <p className="text-azul">
            <Link href="/contacto" className="font-bold underline">
              Ponete en contacto con nuestro equipo
            </Link>
            ; estamos para ayudarte a dar el siguiente paso.
          </p>
        </div>

        <aside className="border-l-2 border-azul pl-6">
          <h2 className="font-titulo text-xl font-bold">Oficina</h2>
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
          <h2 className="mb-12 font-titulo text-3xl font-bold md:text-4xl">El equipo</h2>
          <Equipo />
        </div>
      </section>
    </>
  );
}
