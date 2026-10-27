"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Visor, deslizar } from "@/components/Visor";

export function Galeria({
  fotos,
  alt,
  ajuste = "cover",
}: {
  fotos: { url: string; descripcion: string }[];
  alt: string;
  ajuste?: "cover" | "contain";
}) {
  const [actual, setActual] = useState(0);
  const [grande, setGrande] = useState(false);
  const cantidad = fotos.length;
  const mover = useCallback((paso: number) => setActual((i) => (i + paso + cantidad) % cantidad), [cantidad]);
  const cerrar = useCallback(() => setGrande(false), []);
  if (cantidad === 0) return <div className="aspect-[3/2] bg-fondo" />;

  const flechas = (claseBoton: string) =>
    cantidad > 1 && (
      <>
        <button type="button" onClick={(e) => { e.stopPropagation(); mover(-1); }} aria-label="Foto anterior" className={`absolute top-1/2 left-0 -translate-y-1/2 p-3 ${claseBoton}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); mover(1); }} aria-label="Foto siguiente" className={`absolute top-1/2 right-0 -translate-y-1/2 p-3 ${claseBoton}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </>
    );

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden bg-fondo" {...deslizar(mover)}>
        <button type="button" onClick={() => setGrande(true)} aria-label="Ver foto en grande" className="absolute inset-0 z-0 cursor-zoom-in">
          <Image
            src={fotos[actual].url}
            alt={fotos[actual].descripcion || `${alt}, foto ${actual + 1}`}
            fill
            priority={actual === 0}
            sizes="(min-width: 1024px) 66vw, 100vw"
            className={ajuste === "contain" ? "bg-white object-contain" : "object-cover"}
          />
        </button>
        {flechas("bg-white/90 text-azul hover:bg-white")}
        <button type="button" onClick={() => setGrande(true)} aria-label="Ver foto en grande" className="absolute top-0 right-0 bg-white/90 p-2.5 text-azul hover:bg-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </button>
        {cantidad > 1 && (
          <span className="absolute right-3 bottom-3 bg-azul/85 px-2.5 py-1 text-xs font-bold text-white">
            {actual + 1} / {cantidad}
          </span>
        )}
      </div>
      {cantidad > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {fotos.map((f, i) => (
            <button
              key={f.url}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden ${i === actual ? "ring-2 ring-azul" : "opacity-70 hover:opacity-100"}`}
            >
              <Image src={f.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      {grande && (
        <Visor titulo={`${alt}, fotos`} alCerrar={cerrar} alMover={cantidad > 1 ? mover : undefined}>
          <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} {...deslizar(mover)}>
            <Image
              src={fotos[actual].url}
              alt={fotos[actual].descripcion || `${alt}, foto ${actual + 1}`}
              fill
              sizes="100vw"
              className="object-contain px-2 pb-12 sm:px-16"
            />
          </div>
          {flechas("text-white hover:bg-white/10")}
          {cantidad > 1 && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm font-bold text-white">
              {actual + 1} / {cantidad}
            </span>
          )}
        </Visor>
      )}
    </div>
  );
}
