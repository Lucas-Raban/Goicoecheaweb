import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
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
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } : undefined,
  robots: site.indexar ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${montserrat.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
