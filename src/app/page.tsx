import Link from "next/link";
import { barrios, linkWhatsapp } from "@/lib/site";

const operaciones = [
  {
    titulo: "Venta",
    texto: "Departamentos, casas, locales, terrenos y galpones en Mar del Plata y alrededores.",
    href: "/propiedades",
  },
  {
    titulo: "Alquiler",
    texto: "Alquileres anuales para vivir o para tu negocio, con contrato claro desde el primer día.",
    href: "/propiedades",
  },
  {
    titulo: "Alquiler temporario",
    texto: "Departamentos para la temporada, una escapada o una estadía de trabajo en la ciudad.",
    href: "/propiedades",
  },
  {
    titulo: "Tasaciones",
    texto: "Te decimos cuánto vale tu propiedad hoy, con datos reales del mercado de Mar del Plata.",
    href: "/tasaciones",
  },
];

const motivos = [
  {
    titulo: "Trato directo",
    texto: "Hablás siempre con la misma persona, que conoce tu propiedad y te responde rápido.",
  },
  {
    titulo: "Todo a la vista",
    texto: "Fotos, videos y recorridos virtuales reales, para que sepas qué vas a ver antes de ir.",
  },
  {
    titulo: "Te acompañamos hasta la firma",
    texto: "Reserva, documentación, escritura o contrato: te explicamos cada paso sin vueltas.",
  },
];

export default function Inicio() {
  return (
    <>
      <section className="fondo-lineas text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
          <span className="etiqueta inline-block bg-white px-3 py-2 text-azul">Inmobiliaria en Mar del Plata</span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight font-bold md:text-6xl">
            Vendé, comprá o alquilá tu propiedad con alguien que te conoce
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Somos una inmobiliaria de Mar del Plata, en Alberti 1550. Te decimos lo que vale tu propiedad, te mostramos
            todo con fotos y videos reales, y te acompañamos hasta la firma.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/propiedades" className="etiqueta bg-white px-6 py-4 text-center text-azul hover:bg-fondo">
              Ver propiedades
            </Link>
            <Link
              href="/tasaciones"
              className="etiqueta border border-white px-6 py-4 text-center text-white hover:bg-white hover:text-azul"
            >
              Pedí tu tasación
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="etiqueta text-gris">Qué hacemos</p>
        <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Venta, alquiler y tasaciones</h2>
        <div className="mt-10 grid gap-px border border-borde bg-borde sm:grid-cols-2 lg:grid-cols-4">
          {operaciones.map((op) => (
            <Link key={op.titulo} href={op.href} className="group bg-white p-8 transition hover:bg-azul hover:text-white">
              <h3 className="etiqueta">{op.titulo}</h3>
              <p className="mt-4 text-sm text-gris group-hover:text-white/80">{op.texto}</p>
              <span className="mt-6 inline-block text-sm font-bold">Ver más →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-fondo">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="etiqueta text-gris">Por qué elegirnos</p>
          <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Serios, pero cercanos</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {motivos.map((m) => (
              <div key={m.titulo} className="border-t-2 border-azul pt-6">
                <h3 className="text-lg font-bold">{m.titulo}</h3>
                <p className="mt-3 text-gris">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="etiqueta text-gris">Dónde trabajamos</p>
        <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Propiedades en los barrios de Mar del Plata</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {barrios.map((b) => (
            <li key={b} className="border border-borde px-4 py-2 text-sm">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section className="fondo-lineas text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold">¿Querés saber cuánto vale tu propiedad?</h2>
            <p className="mt-3 text-white/80">Mandanos un mensaje y lo charlamos. La tasación no tiene costo.</p>
          </div>
          <a
            href={linkWhatsapp("Hola, quiero tasar mi propiedad.")}
            target="_blank"
            rel="noopener noreferrer"
            className="etiqueta shrink-0 bg-white px-6 py-4 text-azul hover:bg-fondo"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
