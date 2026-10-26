import Image from "next/image";

// Portada de páginas internas: foto de fondo opcional con el azul de la marca encima.
export function Encabezado({
  etiqueta,
  titulo,
  foto,
  children,
}: {
  etiqueta: string;
  titulo: string;
  foto?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-azul text-white">
      {foto && (
        <>
          <Image src={foto} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-azul/70" />
        </>
      )}
      <div className="mx-auto max-w-7xl px-4 pt-40 pb-20 md:px-8 md:pt-52 md:pb-28">
        <span className="etiqueta inline-block bg-white px-3 py-2 text-azul">{etiqueta}</span>
        <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.02em] text-balance">
          {/* "Mar del Plata" nunca se corta en dos renglones */}
          {titulo.replace(/Mar del Plata/g, "Mar\u00a0del\u00a0Plata")}
        </h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-white/85">{children}</div>}
      </div>
    </section>
  );
}
