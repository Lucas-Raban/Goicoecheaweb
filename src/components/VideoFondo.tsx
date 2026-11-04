"use client";

import { useEffect, useRef, useState } from "react";

// Video de fondo sin sonido y en loop. Queda invisible hasta que empieza a reproducirse, así que si el celular
// no deja reproducirlo solo (por ejemplo el iPhone en modo ahorro de batería) se ve la imagen fija de abajo
// y nunca el botón de play. React no siempre escribe el atributo muted en el HTML y sin él iOS no arranca el
// video, por eso se fuerza acá antes de reproducir.
export function VideoFondo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setReproduciendo(true)}
      className={`${className} pointer-events-none transition-opacity duration-700 ${reproduciendo ? "opacity-100" : "opacity-0"}`}
    />
  );
}
