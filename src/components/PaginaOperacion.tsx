import Link from "next/link";
import { listaBarrios } from "@/lib/barrios";
import { fotos } from "@/lib/fotos";
import { nombresOperacion, type Operacion } from "@/lib/propiedad";
import { getPropiedades } from "@/lib/tokko";
import { Encabezado } from "./Encabezado";
import { Migas } from "./Migas";
import { SinPropiedades } from "./SinPropiedades";
import { GrillaPropiedades } from "./TarjetaPropiedad";

const textos: Record<Operacion, { titulo: string; intro: string; foto: string }> = {
  venta: {
    titulo: "Propiedades en venta en Mar del Plata",
    intro: "Departamentos, casas, PH, locales, terrenos y galpones en venta. Todas las fichas tienen fotos reales y muchas, video o tour 360.",
    foto: fotos.venta,
  },
  alquiler: {
    titulo: "Alquileres en Mar del Plata",
    intro: "Departamentos, casas y locales en alquiler anual. Te explicamos requisitos, garantías y costos de entrada antes de visitar.",
    foto: fotos.alquiler,
  },
  temporario: {
    titulo: "Alquiler temporario en Mar del Plata",
    intro: "Departamentos y casas por semana, quincena o mes. Para enero y febrero conviene reservar con anticipación.",
    foto: fotos.temporario,
  },
};

export async function PaginaOperacion({ operacion, ruta }: { operacion: Operacion; ruta: string }) {
  const texto = textos[operacion];
  const propiedades = (await getPropiedades()).filter((p) => p.operaciones.some((o) => o.tipo === operacion));
  const barriosConPropiedades = listaBarrios.filter((b) => propiedades.some((p) => p.barrioSlug === b.slug));

  return (
    <>
      <Encabezado etiqueta={nombresOperacion[operacion]} titulo={texto.titulo} foto={texto.foto}>
        <p>{texto.intro}</p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas items={[{ nombre: nombresOperacion[operacion], href: ruta }]} />
        <div className="mt-10">
          {propiedades.length > 0 ? (
            <GrillaPropiedades propiedades={propiedades} />
          ) : (
            <SinPropiedades
              titulo="Estamos sumando el catálogo a la web nueva"
              mensaje="Mientras tanto, escribinos y te mandamos las opciones disponibles, o mirá el catálogo en nuestra web actual."
            />
          )}
        </div>
      </section>
      <section className="border-t border-borde bg-fondo">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">{nombresOperacion[operacion]} por barrio</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {(barriosConPropiedades.length > 0 ? barriosConPropiedades : listaBarrios).map((b) => (
              <li key={b.slug}>
                <Link href={`/barrios/${b.slug}`} className="underline-offset-4 hover:underline">
                  {nombresOperacion[operacion]} en {b.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
