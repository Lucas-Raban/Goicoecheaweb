"use client";

import Image from "next/image";
import { useState } from "react";

export function Galeria({ fotos, alt }: { fotos: { url: string; descripcion: string }[]; alt: string }) {
  const [actual, setActual] = useState(0);
  if (fotos.length === 0) return <div className="aspect-[3/2] bg-fondo" />;

  const mover = (paso: number) => setActual((i) => (i + paso + fotos.length) % fotos.length);

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden bg-fondo">
        <Image
          src={fotos[actual].url}
          alt={fotos[actual].descripcion || `${alt}, foto ${actual + 1}`}
          fill
          priority={actual === 0}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
        {fotos.length > 1 && (
          <>
            <button type="button" onClick={() => mover(-1)} aria-label="Foto anterior" className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 p-3 text-azul hover:bg-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Foto siguiente" className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 p-3 text-azul hover:bg-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
            </button>
            <span className="absolute right-3 bottom-3 bg-azul/85 px-2.5 py-1 text-xs font-bold text-white">
              {actual + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>
      {fotos.length > 1 && (
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
    </div>
  );
}
