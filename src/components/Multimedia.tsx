"use client";

import { useState } from "react";
import { Galeria } from "@/components/Galeria";
import { Tour360 } from "@/components/Tour360";
import type { Propiedad } from "@/lib/propiedad";

type Solapa = "fotos" | "video" | "tour" | "plano";

// Fotos, video, tour 360 y plano de la ficha, en solapas. Solo aparecen las que tienen contenido.
export function Multimedia({ p, alt }: { p: Propiedad; alt: string }) {
  const solapas: { id: Solapa; nombre: string }[] = [
    { id: "fotos" as const, nombre: `Fotos${p.fotos.length > 1 ? ` (${p.fotos.length})` : ""}` },
    ...(p.videos.length > 0 || p.videosArchivo.length > 0 ? [{ id: "video" as const, nombre: "Video" }] : []),
    ...(p.panoramas.length > 0 || p.tours.length > 0 ? [{ id: "tour" as const, nombre: "Tour 360" }] : []),
    ...(p.planos.length > 0 ? [{ id: "plano" as const, nombre: p.planos.length > 1 ? "Planos" : "Plano" }] : []),
  ];
  const [actual, setActual] = useState<Solapa>("fotos");

  return (
    <div>
      {solapas.length > 1 && (
        <div role="tablist" aria-label="Fotos, video, tour y plano" className="mb-3 flex gap-6 overflow-x-auto border-b border-borde">
          {solapas.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={actual === s.id}
              onClick={() => setActual(s.id)}
              className={`-mb-px shrink-0 border-b-2 py-3 text-sm font-bold transition-colors ${
                actual === s.id ? "border-azul text-azul" : "border-transparent text-gris hover:text-azul"
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </div>
      )}

      <div role="tabpanel">
        {actual === "fotos" && <Galeria fotos={p.fotos} alt={alt} />}

        {actual === "video" && (
          <div className="space-y-4">
            {p.videos.map((v) => (
              <iframe key={v} src={v} title={`Video de ${p.direccion}`} className="aspect-video w-full" allowFullScreen />
            ))}
            {p.videosArchivo.map((v) => (
              <video key={v} src={v} controls preload="metadata" className="aspect-video w-full bg-black" />
            ))}
          </div>
        )}

        {actual === "tour" && (
          <div className="space-y-4">
            {p.panoramas.length > 0 && <Tour360 panoramas={p.panoramas} direccion={p.direccion} />}
            {p.tours.map((t) => (
              <iframe
                key={t}
                src={t}
                title={`Tour 360 de ${p.direccion}`}
                className="aspect-video w-full"
                allow="xr-spatial-tracking; fullscreen"
                allowFullScreen
              />
            ))}
          </div>
        )}

        {actual === "plano" && <Galeria fotos={p.planos} alt={`Plano de ${p.direccion}`} ajuste="contain" />}
      </div>
    </div>
  );
}
