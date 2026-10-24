import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { fotos } from "@/lib/fotos";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler en Mar del Plata",
  description:
    "Departamentos, casas, locales y terrenos en venta, alquiler y alquiler temporario en Mar del Plata. Fotos, videos y recorridos virtuales.",
  alternates: { canonical: "/propiedades" },
};

// El catálogo se va a leer desde la API de Tokko (paso 2 del plan).
export default function Propiedades() {
  return (
    <>
      <Encabezado etiqueta="Propiedades" titulo="Propiedades en Mar del Plata" foto={fotos.venta}>
        <p>Venta, alquiler y alquiler temporario de departamentos, casas, locales y terrenos.</p>
      </Encabezado>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="rounded-[28px] bg-fondo p-8 md:p-14">
          <h2 className="font-serif text-2xl font-bold">Estamos sumando el catálogo a la web nueva</h2>
          <p className="mt-4 max-w-2xl text-gris">
            Muy pronto vas a poder buscar por operación, barrio, precio y ambientes, con fotos, videos y recorridos
            360. Mientras tanto, podés ver todas las propiedades en nuestra web actual o preguntarnos directamente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.catalogoActual}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-azul px-8 py-4 text-center font-bold text-white hover:bg-azul-claro"
            >
              Ver catálogo completo
            </a>
            <a
              href={linkWhatsapp("Hola, estoy buscando una propiedad.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-8 py-4 text-center font-bold ring-1 ring-azul hover:bg-azul hover:text-white"
            >
              Contanos qué buscás
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
