import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Consulta } from "@/components/Consulta";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Multimedia } from "@/components/Multimedia";
import { TituloFicha } from "@/components/TituloFicha";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { getEmprendimiento, getEmprendimientos, getUnidades } from "@/lib/emprendimientos";
import { site } from "@/lib/site";

const SIN_DATOS = "sin-emprendimientos";

export async function generateStaticParams() {
  const emprendimientos = await getEmprendimientos();
  // Con Cache Components hace falta al menos un parámetro aunque no haya emprendimientos.
  return emprendimientos.length > 0 ? emprendimientos.map((e) => ({ slug: e.slug })) : [{ slug: SIN_DATOS }];
}

export async function generateMetadata({ params }: PageProps<"/emprendimientos/[slug]">): Promise<Metadata> {
  const e = await getEmprendimiento((await params).slug);
  if (!e) return {};
  const etapa = e.estado ? ` ${e.estado.toLowerCase()}` : "";
  return {
    title: `${e.nombre}, emprendimiento${etapa} en ${e.barrio}`,
    description: e.descripcion.replace(/\s+/g, " ").slice(0, 155) || `${e.nombre}, ${e.direccion}, ${e.barrio}, Mar del Plata.`,
    alternates: { canonical: `/emprendimientos/${e.slug}` },
    openGraph: { images: e.fotos.slice(0, 1).map((f) => ({ url: f.url })) },
  };
}

export default async function FichaEmprendimiento({ params }: PageProps<"/emprendimientos/[slug]">) {
  const e = await getEmprendimiento((await params).slug);
  if (!e) notFound();
  const unidades = await getUnidades(e.id);

  const datos = [
    ["Estado", e.estado],
    ["Entrega estimada", e.entrega],
    ["Barrio", e.barrio],
    ["Unidades disponibles", unidades.length || null],
    ["Precio desde", e.precioDesde],
  ].filter(([, v]) => v) as [string, string | number][];

  const mensaje = `Hola, me interesa el emprendimiento ${e.nombre} (${e.direccion}, ${e.barrio}).`;
  const lugarMapa =
    e.lat && e.lng ? `${e.lat},${e.lng}` : encodeURIComponent(`${e.direccion}, ${e.barrio}, Mar del Plata, Buenos Aires`);

  return (
    <article>
      <JsonLd
        datos={{
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          name: e.nombre,
          url: `${site.url}/emprendimientos/${e.slug}`,
          description: e.descripcion.slice(0, 500),
          image: e.fotos.slice(0, 6).map((f) => f.url),
          amenityFeature: e.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
          address: {
            "@type": "PostalAddress",
            streetAddress: e.direccion,
            addressLocality: "Mar del Plata",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
          geo: e.lat && e.lng ? { "@type": "GeoCoordinates", latitude: e.lat, longitude: e.lng } : undefined,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-26">
        <Migas
          items={[
            { nombre: "Emprendimientos", href: "/emprendimientos" },
            { nombre: e.nombre, href: `/emprendimientos/${e.slug}` },
          ]}
        />
        <TituloFicha
          etiqueta={e.estado ?? "Emprendimiento"}
          titulo={e.nombre}
          ubicacion={`${e.direccion}, ${e.barrio}`}
          datos={[e.entrega && `Entrega ${e.entrega}`, unidades.length > 0 && `${unidades.length} ${unidades.length === 1 ? "unidad disponible" : "unidades disponibles"}`].filter(Boolean) as string[]}
          precioEtiqueta={e.precioDesde ? "Unidades desde" : "Precios"}
          precio={e.precioDesde ?? "Consultar"}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mt-5 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <Multimedia p={e} alt={e.nombre} />

            {datos.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 border-t border-l border-borde sm:grid-cols-3">
                {datos.map(([k, v]) => (
                  <div key={k} className="border-r border-b border-borde p-4">
                    <dt className="text-xs text-gris">{k}</dt>
                    <dd className="mt-1 font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {e.descripcion && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">El proyecto</h2>
                <div className="mt-4 leading-relaxed whitespace-pre-line text-gris">{e.descripcion}</div>
              </section>
            )}

            {e.amenities.length > 0 && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">Amenities y características</h2>
                <ul className="mt-4 grid gap-x-8 gap-y-2 text-gris sm:grid-cols-2">
                  {e.amenities.map((a) => (
                    <li key={a} className="border-b border-borde py-2">
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {e.financiacion && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">Formas de pago</h2>
                <div className="mt-4 leading-relaxed whitespace-pre-line text-gris">{e.financiacion}</div>
              </section>
            )}

            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold">Ubicación</h2>
              <iframe
                src={`https://www.google.com/maps?q=${lugarMapa}&z=16&output=embed`}
                title={`Mapa de ${e.nombre}`}
                className="mt-4 h-80 w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Consulta mensaje={mensaje} detalle="Te mandamos precios, planos de cada unidad y el plan de pagos, o coordinamos una visita a la obra." />
          </aside>
        </div>

        {unidades.length > 0 && (
          <section className="mt-24 border-t border-borde pt-16">
            <h2 className="mb-10 font-serif text-3xl font-bold">Unidades disponibles</h2>
            <GrillaPropiedades propiedades={unidades} />
          </section>
        )}
      </div>
    </article>
  );
}
