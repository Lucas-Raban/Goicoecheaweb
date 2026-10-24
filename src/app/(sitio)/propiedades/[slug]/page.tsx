import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";
import { Galeria } from "@/components/Galeria";
import { JsonLd } from "@/components/JsonLd";
import { Migas } from "@/components/Migas";
import { GrillaPropiedades } from "@/components/TarjetaPropiedad";
import { linkWhatsapp, site } from "@/lib/site";
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
  return `${p.tipo}${op} en ${p.barrio}${p.ambientes ? `, ${p.ambientes} ambientes` : ""}`;
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
  const similares = (await getPropiedades())
    .filter(
      (o) =>
        o.id !== p.id && o.operaciones.some((x) => x.tipo === op?.tipo) && (o.barrioSlug === p.barrioSlug || o.tipo === p.tipo),
    )
    .slice(0, 3);

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

      <div className="bg-azul text-white">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 md:px-8 md:pt-36 [&_nav]:text-white/70 [&_nav_span.text-azul]:text-white">
          <Migas
            items={[
              ...(op ? [{ nombre: nombresOperacion[op.tipo], href: rutasOperacion[op.tipo] }] : []),
              { nombre: p.barrio, href: `/barrios/${p.barrioSlug}` },
              { nombre: p.direccion, href: `/propiedades/${p.slug}` },
            ]}
          />

          <header className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              {op && (
                <span className="etiqueta inline-block bg-white px-3 py-2 text-azul">
                  {nombresOperacion[op.tipo]}: {p.tipo}
                </span>
              )}
              <h1 className="mt-4 font-serif text-4xl leading-tight font-bold md:text-5xl">{p.direccion}</h1>
              <p className="mt-2 text-lg text-white/75">
                {p.barrio}, Mar del Plata · {p.titulo}
              </p>
            </div>
            <p className="font-serif text-3xl font-bold md:text-right md:text-4xl">{op?.precio ?? "Consultar precio"}</p>
          </header>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mt-10 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <Galeria fotos={p.fotos} alt={`${p.tipo} en ${p.barrio}`} />

            <dl className="mt-10 grid grid-cols-2 border-t border-l border-borde sm:grid-cols-4">
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

            {(p.videos.length > 0 || p.videosArchivo.length > 0) && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold">Video</h2>
              <div className="mt-4 space-y-4">
                {p.videos.map((v) => (
                  <iframe key={v} src={v} title={`Video de ${p.direccion}`} className="aspect-video w-full" allowFullScreen loading="lazy" />
                ))}
                {p.videosArchivo.map((v) => (
                  <video key={v} src={v} controls preload="metadata" className="aspect-video w-full bg-black" />
                ))}
              </div>
            </section>
          )}

          {p.tours[0] && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">Tour virtual 360</h2>
                <iframe
                  src={p.tours[0]}
                  title={`Tour 360 de ${p.direccion}`}
                  className="mt-4 aspect-video w-full"
                  allow="xr-spatial-tracking; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </section>
            )}

            {p.lat && p.lng && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-bold">Ubicación</h2>
                <iframe
                  src={`https://www.google.com/maps?q=${p.lat},${p.lng}&z=15&output=embed`}
                  title={`Mapa de ${p.direccion}`}
                  className="mt-4 h-80 w-full grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-borde p-6">
              <h2 className="font-serif text-2xl font-bold">¿Te interesa?</h2>
              <p className="mt-2 text-sm text-gris">Coordinamos una visita o te mandamos más información. Código {p.codigo}.</p>
              <a
                href={linkWhatsapp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block bg-whatsapp px-6 py-4 text-center font-bold text-white transition hover:brightness-95"
              >
                Consultar por WhatsApp
              </a>
              <div className="mt-6 border-t border-borde pt-6">
                <FormularioWhatsapp
                  asunto={mensaje}
                  boton="Enviar consulta"
                  campos={[
                    { nombre: "nombre", label: "Tu nombre", requerido: true },
                    { nombre: "telefono", label: "Teléfono", tipo: "tel" },
                    { nombre: "mensaje", label: "Consulta", tipo: "textarea" },
                  ]}
                />
              </div>
            </div>
          </aside>
        </div>

        {similares.length > 0 && (
          <section className="mt-24 border-t border-borde pt-16">
            <h2 className="mb-10 font-serif text-3xl font-bold">Propiedades parecidas</h2>
            <GrillaPropiedades propiedades={similares} />
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
