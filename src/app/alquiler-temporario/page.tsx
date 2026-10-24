import type { Metadata } from "next";
import { PaginaOperacion } from "@/components/PaginaOperacion";

export const metadata: Metadata = {
  title: "Alquiler temporario en Mar del Plata",
  description: "Departamentos y casas en alquiler temporario en Mar del Plata, por semana, quincena o mes. Reservá con Goicoechea Propiedades.",
  alternates: { canonical: "/alquiler-temporario" },
};

export default function Page() {
  return <PaginaOperacion operacion="temporario" ruta="/alquiler-temporario" />;
}
