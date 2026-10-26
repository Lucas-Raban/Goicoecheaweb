// Encabezado de las fichas: operación, título y datos clave a la izquierda; el precio en un bloque azul a la derecha.
export function TituloFicha({
  etiqueta,
  titulo,
  ubicacion,
  datos,
  precioEtiqueta,
  precio,
}: {
  etiqueta?: string;
  titulo: string;
  ubicacion: string;
  datos: string[];
  precioEtiqueta: string;
  precio: string;
}) {
  return (
    <header className="mt-4 grid gap-5 border-b border-borde pb-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
      <div className="min-w-0">
        {etiqueta && <span className="etiqueta inline-block bg-azul px-3 py-1.5 text-white">{etiqueta}</span>}
        <h1 className="mt-3 font-serif text-[2rem] leading-[1.05] font-bold tracking-[-0.01em] md:text-5xl">{titulo}</h1>
        <p className="mt-2 text-gris md:text-lg">{ubicacion}</p>
        {datos.length > 0 && (
          <ul className="mt-4 flex flex-wrap text-sm font-bold md:text-base">
            {datos.map((d, i) => (
              <li key={d} className={`py-1 pr-4 ${i > 0 ? "border-l border-borde pl-4" : ""}`}>
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-azul px-6 py-4 text-white md:min-w-64 md:px-7 md:py-5 md:text-right">
        <p className="text-xs text-white/70 md:text-sm">{precioEtiqueta}</p>
        <p className="mt-1 font-serif text-3xl leading-none font-bold md:text-4xl">{precio}</p>
      </div>
    </header>
  );
}
