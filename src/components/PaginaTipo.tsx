import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fotos } from "@/lib/fotos";
import { nombresOperacion, rutasOperacion, type Operacion } from "@/lib/propiedad";
import { getPropiedades } from "@/lib/propiedades";
import { buscarTipo, esDelTipo, listaTipos } from "@/lib/tipos";
import { Encabezado } from "./Encabezado";
import { Migas } from "./Migas";
import { SinPropiedades } from "./SinPropiedades";
import { GrillaPropiedades } from "./TarjetaPropiedad";

const enOperacion: Record<Operacion, string> = { venta: "en venta", alquiler: "en alquiler", temporario: "en alquiler temporario" };
const fotoOperacion: Record<Operacion, string> = { venta: fotos.venta, alquiler: fotos.alquiler, temporario: fotos.temporario };

export const parametrosTipos = () => listaTipos.map((t) => ({ tipo: t.slug }));

async function propiedadesDe(operacion: Operacion, slug: string) {
  return (await getPropiedades()).filter((p) => p.operaciones.some((o) => o.tipo === operacion) && esDelTipo(p.tipo, slug));
}

// Las páginas sin propiedades no se indexan, para no mostrarle a Google páginas vacías.
export async function metadataTipo(operacion: Operacion, slug: string): Promise<Metadata> {
  const t = buscarTipo(slug);
  if (!t) return {};
  const cantidad = (await propiedadesDe(operacion, slug)).length;
  const titulo = `${t.plural} ${enOperacion[operacion]} en Mar del Plata`;
  return {
    title: titulo,
    description: `${titulo}: fotos reales, video, tour 360 y precio. ${cantidad > 0 ? `${cantidad} disponibles hoy en ` : ""}Goicoechea Propiedades, Alberti 1550.`,
    alternates: { canonical: `${rutasOperacion[operacion]}/${t.slug}` },
    ...(cantidad === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function PaginaTipo({ operacion, slug }: { operacion: Operacion; slug: string }) {
  const t = buscarTipo(slug);
  if (!t) notFound();
  const propiedades = await propiedadesDe(operacion, slug);
  const ruta = rutasOperacion[operacion];
  const titulo = `${t.plural} ${enOperacion[operacion]} en Mar del Plata`;

  return (
    <>
      <Encabezado etiqueta={nombresOperacion[operacion]} titulo={titulo} foto={fotoOperacion[operacion]}>
        <p>
          {propiedades.length > 0
            ? `${propiedades.length} ${propiedades.length === 1 ? "opción disponible" : "opciones disponibles"}, con fotos reales y datos completos.`
            : "Escribinos y te avisamos cuando entre una propiedad así."}
        </p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas
          items={[
            { nombre: nombresOperacion[operacion], href: ruta },
            { nombre: t.plural, href: `${ruta}/${t.slug}` },
          ]}
        />
        <div className="mt-10">
          {propiedades.length > 0 ? (
            <GrillaPropiedades propiedades={propiedades} />
          ) : (
            <SinPropiedades
              titulo={`Por ahora no tenemos ${t.plural.toLowerCase()} ${enOperacion[operacion]} publicados`}
              mensaje="Nos entran propiedades todas las semanas. Contanos qué buscás y te escribimos apenas tengamos algo."
            />
          )}
        </div>
      </section>
    </>
  );
}
