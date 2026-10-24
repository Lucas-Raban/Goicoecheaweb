import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { fotos } from "@/lib/fotos";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Goicoechea Propiedades, inmobiliaria en Alberti 1550, Mar del Plata. Honestidad, trato personalizado y cientos de operaciones concretadas.",
  alternates: { canonical: "/nosotros" },
};

const valores = ["Honestidad", "Trato personalizado", "Ética en cada operación", "Respuestas rápidas"];

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
          <p>Estamos en Alberti 1550, local 1. Si querés pasar o que te llamemos, escribinos.</p>
        </div>

        <aside className="rounded-[28px] bg-fondo p-8">
          <h2 className="etiqueta text-gris">Lo que nos define</h2>
          <ul className="mt-6 space-y-4">
            {valores.map((v) => (
              <li key={v} className="border-b border-borde pb-4 font-bold last:border-0">
                {v}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
