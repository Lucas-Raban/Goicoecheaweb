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
export function Tour360({ panoramas, direccion, inicial = 0 }: { panoramas: Panorama[]; direccion: string; inicial?: number }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const visor = useRef<Viewer | null>(null);
  const marcas = useRef<MarkersPlugin | null>(null);
  const [actual, setActual] = useState(inicial);
  // Si el navegador no puede abrir el visor (sin WebGL 2, celulares viejos) se usa la vista simple. Guarda el motivo para mostrarlo.
  const [sinVisor, setSinVisor] = useState<string | null>(null);

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
    const pasarAFotoPlana = (motivo: string) => {
      visor.current?.destroy();
      visor.current = null;
      if (!cancelado) setSinVisor(motivo);
    };
    if (!document.createElement("canvas").getContext("webgl2")) {
      pasarAFotoPlana("sin WebGL 2");
      return;
    }
    Promise.all([import("@photo-sphere-viewer/core"), import("@photo-sphere-viewer/markers-plugin")])
      .then(([{ Viewer }, { MarkersPlugin }]) => {
        if (cancelado || !contenedor.current) return;
        visor.current = new Viewer({
          container: contenedor.current,
          panorama: panoramas[inicial].url,
          caption: `${panoramas[inicial].ambiente} · ${direccion}`,
          navbar: ["zoom", "move", "caption", "fullscreen"],
          lang: { zoom: "Zoom", zoomOut: "Alejar", zoomIn: "Acercar", moveUp: "Arriba", moveDown: "Abajo", moveLeft: "Izquierda", moveRight: "Derecha", fullscreen: "Pantalla completa", loadError: "No se pudo cargar la foto 360" },
          defaultZoomLvl: 0,
          // La rueda del mouse sigue bajando la página; con un dedo se mueve la foto (con dos pedía "dos dedos" y parecía una foto fija).
          mousewheel: false,
          plugins: [[MarkersPlugin, { markers: puertasDe(inicial) }]],
        });
        visor.current.addEventListener("panorama-error", ({ error }) => pasarAFotoPlana(`foto: ${error?.message ?? "error"}`));
        marcas.current = visor.current.getPlugin<MarkersPlugin>(MarkersPlugin);
        marcas.current.addEventListener("select-marker", ({ marker }) => mostrar(marker.data.destino));
      })
      .catch((e: unknown) => pasarAFotoPlana(`visor: ${e instanceof Error ? e.message : "error"}`));
    return () => {
      cancelado = true;
      visor.current?.destroy();
      visor.current = null;
      marcas.current = null;
    };
    // mostrar y puertasDe solo leen panoramas y direccion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panoramas, direccion, inicial]);

  return (
    <div>
      {sinVisor ? (
        <VistaSimple key={panoramas[actual].url} panorama={panoramas[actual]} direccion={direccion} motivo={sinVisor} />
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

// Vista sin WebGL: la foto 360 se recorre arrastrando de costado (da la vuelta completa), con zoom y pantalla completa.
function VistaSimple({ panorama, direccion, motivo }: { panorama: Panorama; direccion: string; motivo: string }) {
  const [desplazamiento, setDesplazamiento] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [completa, setCompleta] = useState(false);
  const arrastre = useRef<{ x: number; inicio: number } | null>(null);

  return (
    <div className={completa ? "fixed inset-0 z-50 flex flex-col bg-black" : ""}>
      <div
        role="img"
        aria-label={`${panorama.ambiente} · ${direccion}`}
        className={`relative w-full cursor-grab touch-pan-y select-none bg-azul-noche bg-repeat-x active:cursor-grabbing ${completa ? "flex-1" : "aspect-video"}`}
        style={{ backgroundImage: `url("${panorama.url}")`, backgroundSize: `auto ${zoom * 100}%`, backgroundPosition: `${desplazamiento}px center` }}
        onPointerDown={(e) => {
          arrastre.current = { x: e.clientX, inicio: desplazamiento };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => arrastre.current && setDesplazamiento(arrastre.current.inicio + e.clientX - arrastre.current.x)}
        onPointerUp={() => (arrastre.current = null)}
        onPointerCancel={() => (arrastre.current = null)}
      >
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/50 px-2 py-1 text-sm text-white" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" aria-label="Alejar" className="size-8 text-lg" onClick={() => setZoom((z) => Math.max(1, z - 0.5))}>−</button>
          <button type="button" aria-label="Acercar" className="size-8 text-lg" onClick={() => setZoom((z) => Math.min(3, z + 0.5))}>+</button>
          <span className="flex-1 truncate text-center">
            {panorama.ambiente} · {direccion}
          </span>
          <button type="button" className="px-2" onClick={() => setCompleta((c) => !c)}>
            {completa ? "Cerrar" : "Pantalla completa"}
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-gris" title={motivo}>
        Vista simple: arrastrá para girar. Este navegador no abre el recorrido 360 completo ({motivo}).
      </p>
    </div>
  );
}
