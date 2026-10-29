"use client";

import { useEffect, useState } from "react";
import { Galeria } from "@/components/Galeria";
import { Tour360 } from "@/components/Tour360";
import type { Multimediales } from "@/lib/propiedad";

type Solapa = "fotos" | "video" | "tour" | "plano" | "maqueta";

// Íconos de línea finos, uno por solapa.
const iconos: Record<Solapa, React.ReactNode> = {
  fotos: <path d="M4 7h3l1.5-2h7L17 7h3v12H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />,
  video: <path d="M4 6h11v12H4zM15 10.5l5-3v9l-5-3z" />,
  tour: <path d="M3 12c0-2.2 4-4 9-4s9 1.8 9 4-4 4-9 4M12 16l2-2M12 16l2 2M8.5 15.6C5.3 15 3 13.6 3 12" />,
  plano: <path d="M4 4h16v16H4zM4 11h7V4M11 15v5M15 11h5" />,
  maqueta: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
};

// Fotos, video, tour 360, plano y maqueta 3D de la ficha, en solapas tipo carpeta. Solo aparecen las que tienen contenido.
export function Multimedia({ p, alt }: { p: Multimediales; alt: string }) {
  const solapas: { id: Solapa; nombre: string; cantidad?: number }[] = [
    { id: "fotos" as const, nombre: "Fotos", cantidad: p.fotos.length > 1 ? p.fotos.length : undefined },
    ...(p.videos.length > 0 || p.videosArchivo.length > 0 ? [{ id: "video" as const, nombre: "Video" }] : []),
    ...(p.panoramas.length > 0 || p.tours.length > 0 ? [{ id: "tour" as const, nombre: "Tour 360" }] : []),
    ...(p.planos.length > 0 ? [{ id: "plano" as const, nombre: p.planos.length > 1 ? "Planos" : "Plano" }] : []),
    ...(p.maqueta ? [{ id: "maqueta" as const, nombre: "Maqueta 3D" }] : []),
  ];
  const [actual, setActual] = useState<Solapa>("fotos");
  // Foto 360 con la que abre el tour (la elige el punto 360° tocado en la maqueta).
  const [inicioTour, setInicioTour] = useState(0);
  const hayTour = p.panoramas.length > 0 || p.tours.length > 0;

  // Los puntos 360° de la maqueta piden abrir el tour de esta misma ficha.
  useEffect(() => {
    const escuchar = (e: MessageEvent) => {
      if (e.data?.tipo !== "abrir-tour360" || !hayTour) return;
      const indice = Number(e.data.indice);
      setInicioTour(indice >= 0 && indice < p.panoramas.length ? indice : 0);
      setActual("tour");
    };
    window.addEventListener("message", escuchar);
    return () => window.removeEventListener("message", escuchar);
  }, [hayTour, p.panoramas.length]);

  return (
    <div>
      {solapas.length > 1 && (
        <div role="tablist" aria-label="Fotos, video, tour, plano y maqueta" className="flex items-end overflow-x-auto pl-1 [scrollbar-width:none]">
          {solapas.map((s, i) => {
            const activa = actual === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setActual(s.id)}
                style={{ zIndex: activa ? solapas.length + 1 : solapas.length - i }}
                className={`solapa-carpeta relative -ml-3 flex shrink-0 items-center gap-2 pr-7 pl-7 text-sm font-bold transition-colors first:ml-0 ${
                  activa ? "bg-fondo pt-3 pb-2.5 text-azul" : "bg-[#dfe3e9] pt-2.5 pb-2 text-gris hover:bg-[#e9ecf0] hover:text-azul"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                  {iconos[s.id]}
                </svg>
                {s.nombre}
                {s.cantidad && <span className="font-normal text-gris">{s.cantidad}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div role="tabpanel" className={solapas.length > 1 ? "bg-fondo p-2 sm:p-3" : undefined}>
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
            {p.panoramas.length > 0 && <Tour360 key={inicioTour} panoramas={p.panoramas} direccion={p.direccion} inicial={inicioTour} />}
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

        {actual === "maqueta" && p.maqueta && (
          <iframe
            src={p.maqueta}
            title={`Maqueta 3D de ${p.direccion}`}
            className="h-[75svh] max-h-[720px] min-h-[480px] w-full bg-azul-noche"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            allow="fullscreen"
          />
        )}
      </div>
    </div>
  );
}
