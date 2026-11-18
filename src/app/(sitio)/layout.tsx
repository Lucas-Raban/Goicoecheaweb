import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { barrios, site } from "@/lib/site";

const mapa = site.googleBusiness || "https://www.google.com/maps?q=Alberti+1550,+Mar+del+Plata";

// La inmobiliaria (para el panel de Google y las búsquedas locales) y el sitio (para que Google muestre el nombre
// "Goicoechea Propiedades" arriba del resultado). El @id une las dos y las fichas de propiedades.
const datosEstructurados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${site.url}/#inmobiliaria`,
      name: site.nombre,
      description: site.descripcion,
      url: site.url,
      logo: `${site.url}/marca/logo-azul.png`,
      image: `${site.url}/marca/logo-azul.png`,
      telephone: site.telefono,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.direccion.calle,
        addressLocality: site.direccion.ciudad,
        addressRegion: site.direccion.provincia,
        postalCode: site.direccion.codigoPostal,
        addressCountry: site.direccion.codigoPais,
      },
      areaServed: [
        { "@type": "City", name: "Mar del Plata" },
        ...barrios.map((b) => ({ "@type": "Place", name: `${b}, Mar del Plata` })),
      ],
      knowsAbout: ["Venta de propiedades", "Alquiler de propiedades", "Alquiler temporario", "Tasación de propiedades", "Emprendimientos en pozo"],
      hasMap: mapa,
      priceRange: "$$",
      sameAs: [site.redes.instagram, site.redes.facebook, site.googleBusiness].filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#sitio`,
      name: site.nombre,
      alternateName: ["Goicoechea", "Goicoechea Propiedades Mar del Plata"],
      url: site.url,
      inLanguage: "es-AR",
      publisher: { "@id": `${site.url}/#inmobiliaria` },
    },
  ],
};

// Encabezado, pie y botón de WhatsApp de todas las páginas públicas (el panel /admin queda afuera).
export default function SitioLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <JsonLd datos={datosEstructurados} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFlotante />
    </>
  );
}
