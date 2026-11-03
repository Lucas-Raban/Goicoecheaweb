import { linkWhatsapp, site } from "@/lib/site";

// Se muestra cuando todavía no hay propiedades cargadas o la búsqueda no encuentra nada.
export function SinPropiedades({ titulo, mensaje }: { titulo: string; mensaje: string }) {
  return (
    <div className="border border-borde bg-fondo p-8 md:p-12">
      <h2 className="font-titulo text-2xl font-bold">{titulo}</h2>
      <p className="mt-4 max-w-2xl text-gris">{mensaje}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={linkWhatsapp("Hola, estoy buscando una propiedad.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-azul px-7 py-4 text-center font-bold text-white transition hover:bg-azul-claro"
        >
          Contanos qué buscás
        </a>
        <a
          href={site.catalogoActual}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-azul px-7 py-4 text-center font-bold transition hover:bg-azul hover:text-white"
        >
          Ver el catálogo actual
        </a>
      </div>
    </div>
  );
}
