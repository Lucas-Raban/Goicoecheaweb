import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonesDeslizar } from "@/components/BotonesDeslizar";
import { Consulta } from "@/components/Consulta";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { Multimedia } from "@/components/Multimedia";
import { TituloFicha } from "@/components/TituloFicha";
import { datosCortos, TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { getEmprendimientos } from "@/lib/emprendimientos";
import { site } from "@/lib/site";
import { nombresOperacion, rutasOperacion, type Propiedad } from "@/lib/propiedad";
import { getPropiedad, getPropiedades } from "@/lib/propiedades";

const SIN_DATOS = "sin-propiedades";

export async function generateStaticParams() {
  const propiedades = await getPropiedades();
  // Con Cache Components hace falta al menos un parámetro aunque Tokko no devuelva nada.
  return propiedades.length > 0 ? propiedades.map((p) => ({ slug: p.slug })) : [{ slug: SIN_DATOS }];
}

function tituloSeo(p: Propiedad) {
  const op = p.operaciones[0] ? ` en ${nombresOperacion[p.operaciones[0].tipo].toLowerCase()}` : "";
  const ambientes = p.ambientes === 1 ? ", monoambiente" : p.ambientes ? `, ${p.ambientes} ambientes` : "";
  return `${p.tipo}${op} en ${p.barrio}${ambientes}`;
}

export async function generateMetadata({ params }: PageProps<"/propiedades/[slug]">): Promise<Metadata> {
  const p = await getPropiedad((await params).slug);
  if (!p) return {};
  const descripcion = p.descripcion.replace(/\s+/g, " ").slice(0, 155) || `${tituloSeo(p)}. ${p.direccion}, Mar del Plata.`;
  return {
    title: `${tituloSeo(p)} | ${p.direccion}`,
    description: descripcion,
    alternates: { canonical: `/propiedades/${p.slug}` },
    openGraph: { images: p.fotos.slice(0, 1).map((f) => ({ url: f.url })) },
  };
}

export default async function FichaPropiedad({ params }: PageProps<"/propiedades/[slug]">) {
  const { slug } = await params;
  const p = await getPropiedad(slug);
  if (!p) notFound();

  const op = p.operaciones[0];
  const emprendimiento = p.emprendimiento ? (await getEmprendimientos()).find((e) => e.id === p.emprendimiento) : undefined;
  // Recomendaciones coherentes: misma operación y misma cantidad de ambientes (o mismo tipo si no hay ambientes).
  // Entre esas, primero las del mismo barrio y del mismo tipo.
  const puntaje = (o: Propiedad) => (o.barrioSlug === p.barrioSlug ? 2 : 0) + (o.tipo === p.tipo ? 1 : 0);
  const similares = (await getPropiedades())
    .filter(
      (o) =>
        o.id !== p.id &&
        (!op || o.operaciones.some((x) => x.tipo === op.tipo)) &&
        (p.ambientes ? o.ambientes === p.ambientes : o.tipo === p.tipo),
    )
    .sort((a, b) => puntaje(b) - puntaje(a))
    .slice(0, 10);

  const datos = [
    ["Tipo", p.tipo],
    ["Ambientes", p.ambientes],
    ["Dormitorios", p.dormitorios],
    ["Baños", p.banos],
    ["Cocheras", p.cocheras],
    ["Sup. cubierta", p.superficieCubierta && `${p.superficieCubierta} m²`],
    ["Sup. total", p.superficieTotal && `${p.superficieTotal} m²`],
    ["Código", p.codigo],
  ].filter(([, v]) => v) as [string, string | number][];

  const mensaje = `Hola, me interesa la propiedad ${p.codigo} (${p.direccion}, ${p.barrio}).`;
  const url = `${site.url}/propiedades/${p.slug}`;

  // Con coordenadas el punto es exacto; si no, Google ubica la dirección.
  const lugarMapa =
    p.lat && p.lng ? `${p.lat},${p.lng}` : encodeURIComponent(`${p.direccion}, ${p.barrio}, Mar del Plata, Buenos Aires`);

  return (
    <article>
      <JsonLd
        datos={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: tituloSeo(p),
          url,
          description: p.descripcion.slice(0, 500),
          image: p.fotos.slice(0, 6).map((f) => f.url),
          about: {
            "@type": "Accommodation",
            name: p.direccion,
            numberOfRooms: p.ambientes ?? undefined,
            numberOfBedrooms: p.dormitorios ?? undefined,
            numberOfBathroomsTotal: p.banos ?? undefined,
            floorSize: p.superficieCubierta
              ? { "@type": "QuantitativeValue", value: p.superficieCubierta, unitCode: "MTK" }
              : undefined,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Mar del Plata",
              addressRegion: "Buenos Aires",
              addressCountry: "AR",
              streetAddress: p.direccion,
            },
            geo: p.lat && p.lng ? { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } : undefined,
          },
          offers: p.operaciones.map((o) => ({
            "@type": "Offer",
            businessFunction:
              o.tipo === "venta" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
            ...(o.precio
              ? { price: o.precio.replace(/[^\d]/g, ""), priceCurrency: o.precio.startsWith("USD") ? "USD" : "ARS" }
              : {}),
            seller: { "@type": "RealEstateAgent", name: site.nombre, telephone: site.telefono },
          })),
        }}
      />

      {/* Título compacto: la publicación aparece enseguida */}
      <div className="mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-26">
        <Migas
          items={[
            ...(op ? [{ nombre: nombresOperacion[op.tipo], href: rutasOperacion[op.tipo] }] : []),
            { nombre: p.barrio, href: `/barrios/${p.barrioSlug}` },
            { nombre: p.direccion, href: `/propiedades/${p.slug}` },
          ]}
        />
        <TituloFicha
          etiqueta={op ? `${nombresOperacion[op.tipo]}: ${p.tipo}` : p.tipo}
          titulo={p.direccion}
          ubicacion={`${p.barrio}, Mar del Plata`}
          datos={datosCortos(p)}
          precioEtiqueta={op?.precio ? (op.tipo === "venta" ? "Precio de venta" : op.tipo === "alquiler" ? "Alquiler mensual" : "Precio") : "Precio"}
          precio={op?.precio ?? "Consultar"}
        />
        {emprendimiento && (
          <p className="mt-3 text-sm">
            Unidad del emprendimiento{" "}
            <Link href={`/emprendimientos/${emprendimiento.slug}`} className="font-bold underline underline-offset-4">
              {emprendimiento.nombre}
            </Link>
            {emprendimiento.estado && <span className="text-gris"> ({emprendimiento.estado.toLowerCase()})</span>}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mt-5 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <Multimedia p={p} alt={`${p.tipo} en ${p.barrio}`} />
            {p.titulo !== p.direccion && <p className="mt-6 font-serif text-xl leading-snug font-bold md:text-2xl">{p.titulo}</p>}

            <dl className="mt-6 grid grid-cols-2 border-t border-l border-borde sm:grid-cols-4">
              {datos.map(([k, v]) => (
                <div key={k} className="border-r border-b border-borde p-4">
                  <dt className="text-xs text-gris">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>

            {p.descripcion && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">Descripción</h2>
                <div className="mt-4 leading-relaxed whitespace-pre-line text-gris">{p.descripcion}</div>
              </section>
            )}

            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold">Ubicación</h2>
              <iframe
                src={`https://www.google.com/maps?q=${lugarMapa}&z=16&output=embed`}
                title={`Mapa de ${p.direccion}`}
                className="mt-4 h-80 w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Consulta mensaje={mensaje} detalle={`Coordinamos una visita o te mandamos más información. Código ${p.codigo}.`} />
          </aside>
        </div>

        {similares.length > 0 && (
          <section className="mt-24 border-t border-borde pt-16">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl font-bold">También te pueden interesar</h2>
              <BotonesDeslizar objetivo="recomendaciones" fondo="claro" />
            </div>
            <ul
              id="recomendaciones"
              className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0"
            >
              {similares.map((o) => (
                <li key={o.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3rem)/3)]">
                  <TarjetaPropiedad propiedad={o} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-16 text-sm text-gris">
          ¿Buscás otra cosa? Mirá todas las propiedades en{" "}
          <Link href={`/barrios/${p.barrioSlug}`} className="underline">
            {p.barrio}
          </Link>{" "}
          o{" "}
          <Link href="/propiedades" className="underline">
            el catálogo completo
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
