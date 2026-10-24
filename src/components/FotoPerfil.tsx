"use client";

import { useState } from "react";

// Foto de perfil de Instagram a través de unavatar.io; si no carga, muestra las iniciales.
export function FotoPerfil({ usuario, foto, nombre }: { usuario?: string; foto?: string; nombre: string }) {
  const [fallo, setFallo] = useState(false);
  const src = foto ?? (usuario ? `https://unavatar.io/instagram/${usuario}?fallback=false` : undefined);
  const iniciales = nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  if (!src || fallo) {
    return (
      <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-bold text-gris">
        {iniciales}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagen externa chica, no hace falta optimizarla
    <img
      src={src}
      alt={nombre}
      loading="lazy"
      onError={() => setFallo(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
