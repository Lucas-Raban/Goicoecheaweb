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
    <section className="fondo-lineas relative isolate overflow-hidden text-white">
      {foto && (
        <>
          <Image src={foto} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-azul via-azul/85 to-azul/40" />
        </>
      )}
      <div className="mx-auto max-w-7xl px-4 pt-40 pb-20 md:px-8 md:pt-48 md:pb-28">
        <span className="vidrio etiqueta animate-subir inline-block rounded-full px-4 py-2">{etiqueta}</span>
        <h1 className="animate-subir mt-6 max-w-3xl font-serif text-5xl leading-[1.05] font-bold [animation-delay:80ms] md:text-7xl">
          {titulo}
        </h1>
        {children && (
          <div className="animate-subir mt-6 max-w-2xl text-lg text-white/80 [animation-delay:160ms]">{children}</div>
        )}
      </div>
    </section>
  );
}
