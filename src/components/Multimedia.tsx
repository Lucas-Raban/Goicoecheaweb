"use client";

import { useCallback, useEffect, useState } from "react";
import { Galeria } from "@/components/Galeria";
import { Tour360 } from "@/components/Tour360";
import { Visor } from "@/components/Visor";
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
  const hayTour = p.panoramas.length > 0 || p.tours.length > 0;

  // Los puntos 360° de la maqueta piden abrir el tour de esta misma ficha.
  useEffect(() => {
    const escuchar = (e: MessageEvent) => {
      if (e.data?.tipo === "abrir-tour360" && hayTour) setActual("tour");
    };
    window.addEventListener("message", escuchar);
    return () => window.removeEventListener("message", escuchar);
  }, [hayTour]);

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
              <Video key={v} src={v} titulo={`Video de ${p.direccion}`} incrustado />
            ))}
            {p.videosArchivo.map((v) => (
              <Video key={v} src={v} titulo={`Video de ${p.direccion}`} />
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

// Un video de la ficha con un botón para verlo en grande, ocupando toda la pantalla.
function Video({ src, titulo, incrustado = false }: { src: string; titulo: string; incrustado?: boolean }) {
  const [grande, setGrande] = useState(false);
  const cerrar = useCallback(() => setGrande(false), []);
  const reproductor = (clase: string, autoplay = false) =>
    incrustado ? (
      <iframe
        src={autoplay ? `${src}${src.includes("?") ? "&" : "?"}autoplay=1` : src}
        title={titulo}
        className={clase}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <video src={src} controls autoPlay={autoplay} playsInline preload="metadata" className={`bg-black ${clase}`} />
    );

  return (
    <div>
      {reproductor("aspect-video w-full")}
      <button type="button" onClick={() => setGrande(true)} className="mt-2 flex items-center gap-2 text-sm font-bold text-azul hover:underline">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        Ver en grande
      </button>
      {grande && (
        <Visor titulo={titulo} alCerrar={cerrar}>
          <div className="absolute inset-0 flex items-center justify-center px-2 pb-4 sm:px-6" onClick={cerrar}>
            <div className="aspect-video w-[min(100%,calc((100svh-6rem)*16/9))]" onClick={(e) => e.stopPropagation()}>
              {reproductor("h-full w-full", true)}
            </div>
          </div>
        </Visor>
      )}
    </div>
  );
}
