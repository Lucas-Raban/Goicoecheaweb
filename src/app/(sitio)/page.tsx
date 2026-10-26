import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Buscador } from "@/components/Buscador";
import { Equipo } from "@/components/Equipo";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { fotos } from "@/lib/fotos";
import { listaBarrios } from "@/lib/barrios";
import { linkWhatsapp, site } from "@/lib/site";
import { getPropiedades } from "@/lib/propiedades";

const operaciones = [
  {
    etiqueta: "Venta",
    titulo: "Propiedades en venta",
    texto: "Departamentos, casas, PH, locales, terrenos, galpones y campos.",
    href: "/venta",
  },
  {
    etiqueta: "Alquiler",
    titulo: "Alquileres anuales",
    texto: "Para vivir o para tu negocio, con contrato por escrito desde el primer día.",
    href: "/alquiler",
  },
  {
    etiqueta: "Temporario",
    titulo: "Alquiler temporario",
    texto: "Por semana, quincena o mes. En temporada conviene consultar con tiempo.",
    href: "/alquiler-temporario",
  },
  {
    etiqueta: "Emprendimientos",
    titulo: "Emprendimientos",
    texto: "Edificios en pozo y en construcción, con anticipo y cuotas.",
    href: "/emprendimientos",
  },
];

function Flecha({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Inicio() {
  const propiedades = await getPropiedades();
  const destacadas = [...propiedades.filter((p) => p.destacada), ...propiedades.filter((p) => !p.destacada)].slice(0, 6);

  return (
    <>
      {/* Portada a pantalla completa; el buscador queda montado sobre el borde inferior */}
      <section className="relative isolate">
        <div className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-azul text-white">
          <Image src={fotos.hero} alt="Vista aérea de la costa de Mar del Plata" fill priority sizes="100vw" className="-z-20 scale-105 object-cover motion-safe:animate-[acercar_18s_ease-out_both]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-azul/50 via-azul/20 to-azul/80" />
          <div className="mx-auto w-full max-w-7xl px-4 pt-40 pb-28 md:px-8 md:pb-36">
            <h1 className="text-sm font-bold text-white/80">Inmobiliaria en Mar del Plata · Goicoechea Propiedades</h1>
            <p className="mt-4 max-w-5xl font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.02em]">
              Vivir cerca del mar empieza acá
            </p>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 md:px-8">
          <Buscador />
        </div>
      </section>

      {/* Propiedades destacadas, apenas debajo de la portada */}
      {destacadas.length > 0 && (
        <section>
          <div className="mx-auto max-w-7xl px-4 pt-28 pb-8 md:px-8 md:pt-36 md:pb-12">
            <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">Propiedades destacadas</h2>
              <Link href="/propiedades" className="group inline-flex items-center gap-3 font-bold">
                <span className="border-b border-azul pb-1">Ver todas</span>
                <Flecha className="transition group-hover:translate-x-1" />
              </Link>
            </div>
            <GrillaPropiedades propiedades={destacadas} />
          </div>
        </section>
      )}

      {/* Sin destacadas, deja aire para el buscador que sobresale de la portada */}
      {destacadas.length === 0 && <div className="h-24 md:h-28" />}

      {/* Vender o alquilar: imagen a sangre de un lado, texto del otro */}
      <section className="grid bg-azul text-white md:grid-cols-2">
        <div className="relative min-h-[360px] md:min-h-[680px]">
          <Image src={fotos.ciudad} alt="La ciudad de Mar del Plata vista desde el mar" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-20 md:px-16 lg:px-24">
          <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">¿Querés vender o alquilar tu propiedad?</h2>
          <div className="mt-8 max-w-lg space-y-4 text-white/80">
            <p>
              Primero la vemos en persona y te decimos cuánto vale, con precios de operaciones reales de la zona. La
              tasación no se cobra.
            </p>
            <p>
              Después la mostramos bien: fotos con buena luz, un video recorriendo los ambientes y, si suma, un tour 360
              para conocerla desde el celular. Así llegan a la visita personas que ya saben lo que van a ver.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/tasaciones" className="group inline-flex items-center justify-center gap-3 bg-white px-7 py-4 font-bold text-azul transition hover:bg-fondo">
              Pedir una tasación
              <Flecha className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href={linkWhatsapp("Hola, quiero vender o alquilar mi propiedad.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/40 px-7 py-4 font-bold transition hover:border-white"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Accesos rápidos por operación */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">¿Qué estás buscando?</h2>
        <div className="mt-10 grid border-t border-borde md:grid-cols-2 lg:grid-cols-4">
          {operaciones.map((op, i) => (
            <Link
              key={op.etiqueta}
              href={op.href}
              className={`group flex items-start justify-between gap-6 border-b border-borde py-8 md:px-8 md:py-10 lg:border-b-0 ${
                i % 2 === 1 ? "md:border-l" : "md:pl-0"
              } ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <div>
                <h3 className="font-serif text-2xl font-bold group-hover:underline md:text-3xl lg:text-2xl">{op.titulo}</h3>
                <p className="mt-2 max-w-xs text-gris">{op.texto}</p>
              </div>
              <Flecha className="mt-2 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Barrios: grilla compacta con la cantidad de propiedades de cada uno */}
      <section className="bg-azul text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-5xl">Barrios donde trabajamos</h2>
              <p className="mt-4 max-w-lg text-white/75">Tomamos propiedades en toda la ciudad y alrededores.</p>
            </div>
            <Link href="/barrios" className="group inline-flex items-center gap-3 font-bold">
              <span className="border-b border-white pb-1">Todos los barrios</span>
              <Flecha className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 border-t border-l border-white/20 sm:grid-cols-3 lg:grid-cols-5">
            {listaBarrios.map((b) => {
              const cantidad = propiedades.filter((p) => p.barrioSlug === b.slug).length;
              return (
                <li key={b.slug}>
                  <Link
                    href={`/barrios/${b.slug}`}
                    className="group flex h-full items-end justify-between gap-3 border-r border-b border-white/20 p-4 transition-colors duration-300 hover:bg-white hover:text-azul md:p-5"
                  >
                    <div>
                      <h3 className="font-serif text-xl leading-tight font-bold md:text-2xl">{b.nombre}</h3>
                      <p className="mt-1 text-xs text-white/60 group-hover:text-gris">
                        {cantidad > 0 ? `${cantidad} ${cantidad === 1 ? "propiedad" : "propiedades"}` : "Consultanos"}
                      </p>
                    </div>
                    <Flecha className="mb-1 shrink-0 opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Equipo */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">Quiénes son nuestros asesores</h2>
          <p className="text-gris md:justify-self-end md:text-right">
            Somos un equipo chico: cada consulta la sigue la misma persona de principio a fin.
          </p>
        </div>
        <Equipo />
      </section>

      {/* Oficina */}
      <section className="border-t border-borde bg-fondo">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.4fr] md:px-8 md:py-24">
          <div className="self-center">
            <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-5xl">Pasá por la oficina</h2>
            <p className="mt-6 text-lg">
              {site.direccion.calle}
              <br />
              {site.direccion.ciudad}
            </p>
            <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border-b border-azul pb-1 text-lg font-bold">
              {site.telefono}
            </a>
          </div>
          <iframe
            title="Mapa de la oficina de Goicoechea Propiedades"
            src="https://www.google.com/maps?q=Alberti+1550,+Mar+del+Plata&output=embed"
            className="h-80 w-full grayscale md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
