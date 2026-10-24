import type { Metadata } from "next";
import { PaginaOperacion } from "@/components/PaginaOperacion";

export const metadata: Metadata = {
  title: "Propiedades en venta en Mar del Plata",
  description: "Departamentos, casas, PH, locales y terrenos en venta en Mar del Plata, con fotos reales, video y tour 360. Goicoechea Propiedades, Alberti 1550.",
  alternates: { canonical: "/venta" },
};

export default function Page() {
  return <PaginaOperacion operacion="venta" ruta="/venta" />;
}
