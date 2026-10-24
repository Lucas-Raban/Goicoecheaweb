import Image from "next/image";
import Link from "next/link";
import { Buscador } from "@/components/Buscador";
import { Icono360, IconoFlecha, IconoFoto, IconoVideo } from "@/components/Iconos";
import { fotos } from "@/lib/fotos";
import { barrios, linkWhatsapp } from "@/lib/site";

const operaciones = [
  {
    titulo: "Comprar",
    texto: "Departamentos, casas, locales, terrenos y galpones.",
    href: "/propiedades?operacion=venta",
    foto: fotos.venta,
    clases: "md:col-span-2 md:row-span-2 min-h-[420px]",
  },
  {
    titulo: "Alquilar",
    texto: "Alquileres anuales para vivir o para tu negocio.",
    href: "/propiedades?operacion=alquiler",
    foto: fotos.alquiler,
    clases: "min-h-[260px]",
  },
  {
    titulo: "Alquiler temporario",
    texto: "Para la temporada, una escapada o una estadía de trabajo.",
    href: "/propiedades?operacion=temporario",
    foto: fotos.temporario,
    clases: "min-h-[260px]",
  },
];

const recursos = [
  { icono: <IconoFoto />, titulo: "Fotos reales", texto: "Sin retoques que engañen. Lo que ves es lo que vas a encontrar." },
  { icono: <IconoVideo />, titulo: "Video de cada propiedad", texto: "Recorrés los ambientes antes de coordinar la visita." },
  { icono: <Icono360 />, titulo: "Tour virtual 360", texto: "Te movés por la propiedad desde el celular, como si estuvieras ahí." },
];

const pasos = [
  { titulo: "Nos contás qué buscás", texto: "Por WhatsApp, por teléfono o en la oficina de Alberti 1550." },
  { titulo: "Te mostramos opciones", texto: "Solo las que encajan con lo que necesitás, con fotos y videos." },
  { titulo: "Te acompañamos hasta la firma", texto: "Reserva, documentación, escritura o contrato, sin vueltas." },
];

export default function Inicio() {
  return (
    <>
      {/* Portada */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-azul text-white">
        <Image src={fotos.hero} alt="Vista aérea de la costa de Mar del Plata" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-azul via-azul/60 to-azul/30" />
        <div className="mx-auto w-full max-w-7xl px-4 pt-36 pb-12 md:px-8 md:pb-20">
          <span className="vidrio etiqueta animate-subir inline-block rounded-full px-4 py-2">Inmobiliaria en Mar del Plata</span>
          <h1 className="animate-subir mt-6 max-w-4xl font-serif text-5xl leading-[1.02] font-bold [animation-delay:100ms] sm:text-6xl md:text-8xl">
            Tu próxima casa está en Mar del Plata
          </h1>
          <p className="animate-subir mt-6 max-w-xl text-lg text-white/85 [animation-delay:200ms]">
            Vendé, comprá o alquilá con alguien que conoce la ciudad y te acompaña hasta la firma.
          </p>
          <div className="animate-subir mt-10 max-w-3xl [animation-delay:300ms]">
            <Buscador />
          </div>
        </div>
      </section>

      {/* Operaciones */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <div className="revelar flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="etiqueta text-gris">Qué estás buscando</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight font-bold md:text-6xl">Venta, alquiler y temporario</h2>
          </div>
          <Link href="/propiedades" className="group inline-flex items-center gap-2 font-bold">
            Ver todas las propiedades
            <IconoFlecha className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {operaciones.map((op) => (
            <Link
              key={op.titulo}
              href={op.href}
              className={`revelar group relative isolate flex flex-col justify-end overflow-hidden rounded-[28px] p-7 text-white ${op.clases}`}
            >
              <Image src={op.foto} alt="" fill sizes="(min-width: 768px) 66vw, 100vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-azul/90 via-azul/30 to-transparent" />
              <span className="vidrio absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full transition group-hover:bg-white group-hover:text-azul">
                <IconoFlecha />
              </span>
              <h3 className="font-serif text-3xl font-bold md:text-4xl">{op.titulo}</h3>
              <p className="mt-2 max-w-sm text-white/80">{op.texto}</p>
            </Link>
          ))}
          <Link
            href="/tasaciones"
            className="revelar group fondo-lineas relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white md:col-span-3"
          >
            <span className="etiqueta text-white/60">Tasaciones sin costo</span>
            <div className="flex items-end justify-between gap-6">
              <h3 className="max-w-md font-serif text-3xl font-bold md:text-4xl">¿Cuánto vale tu propiedad hoy?</h3>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-azul transition group-hover:scale-110">
                <IconoFlecha />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Fotos, video y 360 */}
      <section className="bg-fondo">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <div className="revelar max-w-2xl">
            <p className="etiqueta text-gris">Todo a la vista</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight font-bold md:text-6xl">Conocé la propiedad antes de ir</h2>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {recursos.map((r) => (
              <div key={r.titulo} className="revelar rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-borde transition hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-azul text-white">{r.icono}</span>
                <h3 className="mt-8 text-xl font-bold">{r.titulo}</h3>
                <p className="mt-3 text-gris">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-24 md:grid-cols-2 md:px-8 md:py-32">
        <div className="revelar relative min-h-[420px] overflow-hidden rounded-[28px]">
          <Image src={fotos.ciudad} alt="La ciudad de Mar del Plata vista desde el mar" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="revelar flex flex-col justify-center">
          <p className="etiqueta text-gris">Cómo trabajamos</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-bold md:text-5xl">Serios, pero cercanos</h2>
          <ol className="mt-10 space-y-8">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="flex gap-6">
                <span className="font-serif text-5xl leading-none font-bold text-borde">0{i + 1}</span>
                <div className="border-b border-borde pb-8">
                  <h3 className="text-lg font-bold">{p.titulo}</h3>
                  <p className="mt-2 text-gris">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Barrios */}
      <section className="fondo-lineas text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <div className="revelar max-w-2xl">
            <p className="etiqueta text-white/60">Dónde trabajamos</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight font-bold md:text-6xl">Propiedades en toda la ciudad</h2>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
            {barrios.map((b) => (
              <li key={b} className="revelar">
                <Link
                  href={`/propiedades?barrio=${encodeURIComponent(b)}`}
                  className="group flex h-full items-center justify-between gap-2 rounded-2xl border border-white/15 px-5 py-5 text-sm font-bold transition hover:border-white hover:bg-white hover:text-azul"
                >
                  {b}
                  <IconoFlecha className="shrink-0 opacity-50 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Llamado final */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="revelar flex flex-col items-start justify-between gap-8 rounded-[28px] bg-fondo p-8 md:flex-row md:items-center md:p-14">
          <div>
            <h2 className="font-serif text-3xl font-bold md:text-5xl">¿Querés vender o alquilar tu propiedad?</h2>
            <p className="mt-4 max-w-xl text-gris">Mandanos un mensaje y lo charlamos. Te decimos lo que vale y cómo la vamos a mostrar.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={linkWhatsapp("Hola, quiero vender o alquilar mi propiedad.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-azul px-8 py-4 text-center font-bold whitespace-nowrap text-white transition hover:bg-azul-claro"
            >
              Escribinos
            </a>
            <Link href="/tasaciones" className="rounded-full px-8 py-4 text-center font-bold whitespace-nowrap ring-1 ring-azul transition hover:bg-azul hover:text-white">
              Pedí tu tasación
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
