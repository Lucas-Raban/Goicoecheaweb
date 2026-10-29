"use client";

import { useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { slugify } from "@/lib/texto";

type Panorama = { url: string; ambiente: string; puertas?: { destino: string; posicion: number }[] };

// Flecha que se dibuja dentro de la foto, en la puerta hacia otro ambiente.
const flecha = (destino: string) =>
  `<span class="flex flex-col items-center gap-1 cursor-pointer select-none">
    <span class="flex size-12 items-center justify-center rounded-full border-2 border-white bg-azul/80 text-white shadow-lg">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </span>
    <span class="bg-azul/80 px-2 py-0.5 text-sm text-white">${destino.replace(/</g, "&lt;")}</span>
  </span>`;

// Visor de fotos 360 cargadas en el panel. Se pasa de un ambiente a otro con las flechas dentro de la foto o con los botones de abajo.
export function Tour360({ panoramas, direccion }: { panoramas: Panorama[]; direccion: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const visor = useRef<Viewer | null>(null);
  const marcas = useRef<MarkersPlugin | null>(null);
  const [actual, setActual] = useState(0);
  // Si el navegador no puede abrir el visor (sin WebGL 2, celulares viejos), se muestra la foto plana para recorrer deslizando.
  const [sinVisor, setSinVisor] = useState(false);

  // Las puertas de un ambiente, como marcas del visor. El destino se busca por nombre de ambiente.
  function puertasDe(i: number) {
    return (panoramas[i].puertas ?? []).flatMap((p, n) => {
      const destino = panoramas.findIndex((x) => slugify(x.ambiente) === slugify(p.destino));
      if (destino < 0 || destino === i) return [];
      return [
        {
          id: `puerta-${i}-${n}`,
          html: flecha(panoramas[destino].ambiente),
          position: { yaw: ((p.posicion / 100) * 360 - 180) * (Math.PI / 180), pitch: -0.25 },
          anchor: "center center",
          data: { destino },
        },
      ];
    });
  }

  function mostrar(i: number) {
    setActual(i);
    marcas.current?.clearMarkers();
    visor.current
      ?.setPanorama(panoramas[i].url, { caption: `${panoramas[i].ambiente} · ${direccion}` })
      .then(() => marcas.current?.setMarkers(puertasDe(i)));
  }

  useEffect(() => {
    let cancelado = false;
    const pasarAFotoPlana = () => {
      visor.current?.destroy();
      visor.current = null;
      if (!cancelado) setSinVisor(true);
    };
    if (!document.createElement("canvas").getContext("webgl2")) {
      pasarAFotoPlana();
      return;
    }
    Promise.all([import("@photo-sphere-viewer/core"), import("@photo-sphere-viewer/markers-plugin")])
      .then(([{ Viewer }, { MarkersPlugin }]) => {
        if (cancelado || !contenedor.current) return;
        visor.current = new Viewer({
          container: contenedor.current,
          panorama: panoramas[0].url,
          caption: `${panoramas[0].ambiente} · ${direccion}`,
          navbar: ["zoom", "move", "caption", "fullscreen"],
          lang: { zoom: "Zoom", zoomOut: "Alejar", zoomIn: "Acercar", moveUp: "Arriba", moveDown: "Abajo", moveLeft: "Izquierda", moveRight: "Derecha", fullscreen: "Pantalla completa", loadError: "No se pudo cargar la foto 360" },
          defaultZoomLvl: 0,
          // La rueda del mouse sigue bajando la página; con un dedo se mueve la foto (con dos pedía "dos dedos" y parecía una foto fija).
          mousewheel: false,
          plugins: [[MarkersPlugin, { markers: puertasDe(0) }]],
        });
        visor.current.addEventListener("panorama-error", pasarAFotoPlana);
        marcas.current = visor.current.getPlugin<MarkersPlugin>(MarkersPlugin);
        marcas.current.addEventListener("select-marker", ({ marker }) => mostrar(marker.data.destino));
      })
      .catch(pasarAFotoPlana);
    return () => {
      cancelado = true;
      visor.current?.destroy();
      visor.current = null;
      marcas.current = null;
    };
    // mostrar y puertasDe solo leen panoramas y direccion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panoramas, direccion]);

  return (
    <div>
      {sinVisor ? (
        <div className="aspect-video w-full overflow-x-auto bg-azul-noche">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={panoramas[actual].url} alt={`${panoramas[actual].ambiente} · ${direccion}`} className="h-full w-auto max-w-none" />
        </div>
      ) : (
        <div ref={contenedor} className="aspect-video w-full bg-azul-noche" />
      )}
      {panoramas.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {panoramas.map((p, i) => (
            <button
              key={p.url}
              type="button"
              onClick={() => (sinVisor ? setActual(i) : mostrar(i))}
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
