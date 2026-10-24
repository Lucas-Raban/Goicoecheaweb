import type { Metadata } from "next";
import { PaginaOperacion } from "@/components/PaginaOperacion";

export const metadata: Metadata = {
  title: "Alquileres en Mar del Plata",
  description: "Departamentos, casas y locales en alquiler anual en Mar del Plata. Consultá requisitos y visitas con Goicoechea Propiedades.",
  alternates: { canonical: "/alquiler" },
};

export default function Page() {
  return <PaginaOperacion operacion="alquiler" ruta="/alquiler" />;
}
