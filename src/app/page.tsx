import Image from "next/image";
import Link from "next/link";
import { Buscador } from "@/components/Buscador";
import { fotos } from "@/lib/fotos";
import { barrios, linkWhatsapp, site } from "@/lib/site";

const operaciones = [
  {
    etiqueta: "Venta",
    titulo: "Propiedades en venta",
    texto: "Departamentos, casas, PH, locales, terrenos, galpones y campos.",
    href: "/propiedades?operacion=venta",
    foto: fotos.venta,
  },
  {
    etiqueta: "Alquiler",
    titulo: "Alquileres anuales",
    texto: "Para vivir o para poner tu negocio, con contrato por escrito desde el primer día.",
    href: "/propiedades?operacion=alquiler",
    foto: fotos.alquiler,
  },
  {
    etiqueta: "Temporario",
    titulo: "Alquiler temporario",
    texto: "Por semana, quincena o mes. En temporada conviene consultar con tiempo.",
    href: "/propiedades?operacion=temporario",
    foto: fotos.temporario,
  },
];

export default function Inicio() {
  return (
    <>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-azul text-white">
        <Image src={fotos.hero} alt="Vista aérea de la costa de Mar del Plata" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-azul/55" />
        <div className="mx-auto w-full max-w-7xl px-4 pt-36 pb-14 md:px-8 md:pb-20">
          <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] font-bold sm:text-6xl md:text-7xl">
            Inmobiliaria en Mar del Plata
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Venta, alquiler y alquiler temporario. Estamos en Alberti 1550 y atendemos personalmente cada consulta.
          </p>
          <div className="mt-10 max-w-3xl">
            <Buscador />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <h2 className="font-serif text-3xl font-bold md:text-4xl">¿Qué estás buscando?</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
          {operaciones.map((op) => (
            <Link key={op.etiqueta} href={op.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-fondo">
                <Image src={op.foto} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="etiqueta absolute top-0 left-0 bg-white px-3 py-2 text-azul">{op.etiqueta}</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-bold group-hover:underline">{op.titulo}</h3>
              <p className="mt-2 text-gris">{op.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-borde bg-fondo">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-24">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <Image src={fotos.ciudad} alt="La ciudad de Mar del Plata vista desde el mar" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="self-center">
            <h2 className="font-serif text-3xl font-bold md:text-4xl">¿Querés vender o alquilar tu propiedad?</h2>
            <div className="mt-6 space-y-4 text-gris">
              <p>
                Primero la vemos en persona y te decimos cuánto vale, con precios de operaciones reales de la zona. La
                tasación no se cobra.
              </p>
              <p>
                Después la mostramos bien: fotos hechas con buena luz, un video recorriendo los ambientes y, si suma, un
                tour 360 para que la puedan conocer desde el celular. Así llegan a visitarla personas que ya saben lo que
                van a ver.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tasaciones" className="bg-azul px-7 py-4 text-center font-bold text-white transition hover:bg-azul-claro">
                Pedir una tasación
              </Link>
              <a
                href={linkWhatsapp("Hola, quiero vender o alquilar mi propiedad.")}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-azul px-7 py-4 text-center font-bold transition hover:bg-azul hover:text-white"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <div>
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Barrios donde trabajamos</h2>
          <p className="mt-4 max-w-md text-gris">
            Tomamos propiedades en toda la ciudad y alrededores. Estos son los barrios donde más operaciones hacemos.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 border-t border-borde">
            {barrios.map((b) => (
              <li key={b} className="border-b border-borde">
                <Link href={`/propiedades?barrio=${encodeURIComponent(b)}`} className="block py-3 hover:underline">
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Pasá por la oficina</h2>
          <p className="mt-4 text-gris">
            {site.direccion.calle}, {site.direccion.ciudad}. También podés llamarnos o escribirnos al{" "}
            <a href={linkWhatsapp()} className="font-bold text-azul underline">
              {site.telefono}
            </a>
            .
          </p>
          <iframe
            title="Mapa de la oficina de Goicoechea Propiedades"
            src="https://www.google.com/maps?q=Alberti+1550,+Mar+del+Plata&output=embed"
            className="mt-8 h-80 w-full border border-borde"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
