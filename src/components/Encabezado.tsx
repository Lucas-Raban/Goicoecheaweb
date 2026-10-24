// Bloque de título para páginas internas, con el estilo de las piezas de redes.
export function Encabezado({ etiqueta, titulo, children }: { etiqueta: string; titulo: string; children?: React.ReactNode }) {
  return (
    <section className="fondo-lineas text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <span className="etiqueta inline-block bg-white px-3 py-2 text-azul">{etiqueta}</span>
        <h1 className="mt-5 font-serif text-4xl font-bold md:text-5xl">{titulo}</h1>
        {children && <div className="mt-4 max-w-2xl text-white/80">{children}</div>}
      </div>
    </section>
  );
}
