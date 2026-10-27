export type DatoFicha = { icono: keyof typeof iconos; texto: string };

// Íconos de línea finos para los datos clave.
const iconos = {
  ambientes: <path d="M4 4h16v16H4zM12 4v9M12 17v3M4 12h5" />,
  dormitorios: <path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6M6.5 11.5a1.5 1.5 0 1 0 0-.01" />,
  banos: <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />,
  superficie: <path d="M4 20V4l16 16zM8 16h3M4 8h2M4 12h2" />,
  entrega: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  unidades: <path d="M5 21V4h14v17M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4" />,
};

// Encabezado de las fichas: título y datos clave a la izquierda, precio grande a la derecha.
export function TituloFicha({
  antetitulo,
  titulo,
  datos,
  precioEtiqueta,
  precio,
}: {
  antetitulo: string;
  titulo: string;
  // Los datos que no están (null, 0, false) se omiten.
  datos: (DatoFicha | null | false | 0 | "" | undefined)[];
  precioEtiqueta: string;
  precio: string;
}) {
  const visibles = datos.filter((d): d is DatoFicha => Boolean(d));
  // "USD 86.000" → moneda chica y número grande.
  const [moneda, ...resto] = precio.split(" ");
  const numero = resto.join(" ");

  return (
    <header className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
      <div className="min-w-0">
        <p className="text-sm font-bold text-gris">{antetitulo}</p>
        <h1 className="mt-2 font-titulo text-[2rem] leading-[1.1] font-bold tracking-[-0.03em] md:text-[2.75rem]">{titulo}</h1>
        {visibles.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {visibles.map((d) => (
              <li key={d.texto} className="flex items-center gap-2 text-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gris" aria-hidden="true">
                  {iconos[d.icono]}
                </svg>
                {d.texto}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-borde pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-12 md:text-right">
        <p className="text-sm text-gris">{precioEtiqueta}</p>
        <p className="mt-1 leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap">
          {numero ? (
            <>
              <span className="mr-1.5 text-xl text-gris md:text-2xl">{moneda}</span>
              <span className="text-[2.5rem] md:text-5xl">{numero}</span>
            </>
          ) : (
            <span className="text-3xl md:text-4xl">{precio}</span>
          )}
        </p>
      </div>
    </header>
  );
}
