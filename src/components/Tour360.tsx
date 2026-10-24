"use client";

import { useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

// Visor de fotos 360 cargadas en el panel. Un botón por ambiente para pasar de uno a otro.
export function Tour360({ panoramas, direccion }: { panoramas: { url: string; ambiente: string }[]; direccion: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const visor = useRef<Viewer | null>(null);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    let cancelado = false;
    import("@photo-sphere-viewer/core").then(({ Viewer }) => {
      if (cancelado || !contenedor.current) return;
      visor.current = new Viewer({
        container: contenedor.current,
        panorama: panoramas[0].url,
        caption: `${panoramas[0].ambiente} · ${direccion}`,
        navbar: ["zoom", "move", "caption", "fullscreen"],
        lang: { zoom: "Zoom", zoomOut: "Alejar", zoomIn: "Acercar", moveUp: "Arriba", moveDown: "Abajo", moveLeft: "Izquierda", moveRight: "Derecha", fullscreen: "Pantalla completa", loadError: "No se pudo cargar la foto 360" },
        defaultZoomLvl: 0,
        mousewheel: false,
        touchmoveTwoFingers: true,
      });
    });
    return () => {
      cancelado = true;
      visor.current?.destroy();
      visor.current = null;
    };
  }, [panoramas, direccion]);

  function mostrar(i: number) {
    setActual(i);
    visor.current?.setPanorama(panoramas[i].url, { caption: `${panoramas[i].ambiente} · ${direccion}` });
  }

  return (
    <div>
      <div ref={contenedor} className="aspect-video w-full bg-azul-noche" />
      {panoramas.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {panoramas.map((p, i) => (
            <button
              key={p.url}
              type="button"
              onClick={() => mostrar(i)}
              className={`border px-3 py-1.5 text-sm transition-colors ${i === actual ? "border-azul bg-azul text-white" : "border-borde hover:border-azul"}`}
            >
              {p.ambiente}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
