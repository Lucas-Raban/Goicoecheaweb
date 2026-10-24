import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { site } from "@/lib/site";

const datosEstructurados = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.nombre,
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
    addressCountry: site.direccion.codigoPais,
  },
  areaServed: { "@type": "City", name: "Mar del Plata" },
  hasMap: "https://www.google.com/maps?q=Alberti+1550,+Mar+del+Plata",
  priceRange: "$$",
  sameAs: [site.redes.instagram, site.redes.facebook],
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
