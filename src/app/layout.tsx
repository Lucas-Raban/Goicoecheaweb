import type { Metadata } from "next";
import { Montserrat, Tinos } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Inmobiliaria en Mar del Plata | Goicoechea Propiedades",
    template: "%s | Goicoechea Propiedades",
  },
  description: site.descripcion,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.nombre,
    images: [{ url: "/marca/logo-azul.png", width: 1280, height: 276, alt: site.nombre }],
  },
  robots: site.indexar ? { index: true, follow: true } : { index: false, follow: false },
};

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
  sameAs: [site.redes.instagram, site.redes.facebook],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${montserrat.variable} ${tinos.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados).replace(/</g, "\\u003c") }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
