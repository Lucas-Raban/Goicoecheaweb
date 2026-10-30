"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { BotonExpandir, usePantallaCompleta } from "@/components/PantallaCompleta";

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
  const cerrar = useCallback(() => setGrande(false), []);
  usePantallaCompleta(grande, cerrar);
  // En pantalla completa se pasa de foto deslizando el dedo.
  const toque = useRef<number | null>(null);
  if (fotos.length === 0) return <div className="aspect-[3/2] bg-fondo" />;

  const mover = (paso: number) => setActual((i) => (i + paso + fotos.length) % fotos.length);
  const descripcion = fotos[actual].descripcion || `${alt}, foto ${actual + 1}`;

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden bg-fondo">
        <Image
          unoptimized
          src={fotos[actual].url}
          alt={descripcion}
          fill
          priority={actual === 0}
          sizes="(min-width: 1024px) 66vw, 100vw"
          onClick={() => setGrande(true)}
          className={`cursor-zoom-in ${ajuste === "contain" ? "bg-white object-contain" : "object-cover"}`}
        />
        <BotonExpandir abierta={false} onClick={() => setGrande(true)} className="absolute top-3 right-3" />
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
      {grande && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}, fotos en pantalla completa`}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") mover(-1);
            if (e.key === "ArrowRight") mover(1);
          }}
        >
          <div
            className="relative flex-1 touch-pan-y select-none"
            onPointerDown={(e) => (toque.current = e.clientX)}
            onPointerUp={(e) => {
              if (toque.current === null) return;
              const distancia = e.clientX - toque.current;
              toque.current = null;
              if (Math.abs(distancia) > 50) mover(distancia < 0 ? 1 : -1);
            }}
            onPointerCancel={() => (toque.current = null)}
          >
            <Image unoptimized src={fotos[actual].url} alt={descripcion} fill sizes="100vw" className={`object-contain ${ajuste === "contain" ? "bg-white" : ""}`} />
          </div>
          <BotonExpandir abierta onClick={cerrar} className="absolute top-3 right-3" />
          {fotos.length > 1 && (
            <>
              <button type="button" autoFocus onClick={() => mover(-1)} aria-label="Foto anterior" className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 p-3 text-azul hover:bg-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
              </button>
              <button type="button" onClick={() => mover(1)} aria-label="Foto siguiente" className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 p-3 text-azul hover:bg-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-azul/85 px-2.5 py-1 text-sm font-bold text-white">
                {actual + 1} / {fotos.length}
              </span>
            </>
          )}
        </div>
      )}
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
              <Image unoptimized src={f.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
