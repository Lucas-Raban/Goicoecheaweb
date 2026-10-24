import Image from "next/image";
import Link from "next/link";
import { BotonesDeslizar } from "@/components/BotonesDeslizar";
import { Buscador } from "@/components/Buscador";
import { Equipo } from "@/components/Equipo";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { fotos } from "@/lib/fotos";
import { listaBarrios } from "@/lib/barrios";
import { linkWhatsapp, site } from "@/lib/site";
import { getPropiedades } from "@/lib/tokko";

const operaciones = [
  {
    etiqueta: "Venta",
    titulo: "Propiedades en venta",
    texto: "Departamentos, casas, PH, locales, terrenos, galpones y campos.",
    href: "/venta",
    foto: fotos.venta,
  },
  {
    etiqueta: "Alquiler",
    titulo: "Alquileres anuales",
    texto: "Para vivir o para tu negocio, con contrato por escrito desde el primer día.",
    href: "/alquiler",
    foto: fotos.alquiler,
  },
  {
    etiqueta: "Temporario",
    titulo: "Alquiler temporario",
    texto: "Por semana, quincena o mes. En temporada conviene consultar con tiempo.",
    href: "/alquiler-temporario",
    foto: fotos.temporario,
  },
];

function Flecha({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

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

      {/* Operaciones, en grilla asimétrica */}
      <section className="mx-auto max-w-7xl px-4 pt-28 pb-24 md:px-8 md:pt-36 md:pb-32">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">¿Qué estás buscando?</h2>
          <Link href="/propiedades" className="group inline-flex items-center gap-3 font-bold">
            <span className="border-b border-azul pb-1">Ver todas las propiedades</span>
            <Flecha className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-12">
          {operaciones.map((op, i) => (
            <Link
              key={op.etiqueta}
              href={op.href}
              className={`group block ${i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"}`}
            >
              <div className={`relative overflow-hidden bg-fondo ${i === 0 ? "aspect-[4/3] md:aspect-[5/6]" : "aspect-[16/10]"}`}>
                <Image src={op.foto} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                <span className="etiqueta absolute top-0 left-0 bg-white px-3 py-2 text-azul">{op.etiqueta}</span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className={`font-serif font-bold ${i === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>{op.titulo}</h3>
                  <p className="mt-2 max-w-md text-gris">{op.texto}</p>
                </div>
                <Flecha className="mt-2 shrink-0 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Barrios: tira horizontal que se desliza, con la cantidad de propiedades de cada uno */}
      <section className="overflow-hidden bg-azul text-white">
        <div className="mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-32">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">Barrios donde trabajamos</h2>
              <p className="mt-5 max-w-lg text-white/75">
                Tomamos propiedades en toda la ciudad y alrededores. Elegí un barrio para ver cómo es y qué tenemos ahí.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/barrios" className="group inline-flex items-center gap-3 font-bold">
                <span className="border-b border-white pb-1">Todos los barrios</span>
                <Flecha className="transition group-hover:translate-x-1" />
              </Link>
              <BotonesDeslizar objetivo="tira-barrios" />
            </div>
          </div>
        </div>
        <ul id="tira-barrios" className="mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-24 [scrollbar-width:none] md:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] md:pb-32">
          {listaBarrios.map((b) => {
            const cantidad = propiedades.filter((p) => p.barrioSlug === b.slug).length;
            return (
              <li key={b.slug} className="shrink-0 snap-start">
                <Link
                  href={`/barrios/${b.slug}`}
                  className="group flex h-[340px] w-[260px] flex-col justify-between border border-white/20 p-6 transition-colors duration-300 hover:border-white hover:bg-white hover:text-azul md:h-[400px] md:w-[300px]"
                >
                  <span className="text-sm text-white/60 group-hover:text-gris">
                    {cantidad > 0 ? `${cantidad} ${cantidad === 1 ? "propiedad" : "propiedades"}` : "Consultanos"}
                  </span>
                  <div>
                    <h3 className="font-serif text-4xl leading-none font-bold">{b.nombre}</h3>
                    <p className="mt-4 text-sm text-white/70 group-hover:text-gris">{b.resumen}</p>
                    <Flecha className="mt-6 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Equipo */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 className="font-serif text-4xl leading-[1.05] font-bold tracking-[-0.01em] md:text-6xl">Quiénes te van a atender</h2>
          <p className="text-gris md:justify-self-end md:text-right">
            Somos un equipo chico: cada consulta la sigue la misma persona de principio a fin.
          </p>
        </div>
        <Equipo />
      </section>

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
