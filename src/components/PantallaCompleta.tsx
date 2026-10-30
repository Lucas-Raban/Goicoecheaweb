"use client";

import { useEffect } from "react";

// Mientras la vista está agrandada: Escape la cierra y la página de atrás no se desplaza.
export function usePantallaCompleta(abierta: boolean, cerrar: () => void) {
  useEffect(() => {
    if (!abierta) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    const desborde = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = desborde;
      window.removeEventListener("keydown", tecla);
    };
  }, [abierta, cerrar]);
}

// Botón cuadrado de expandir / cerrar, en la esquina de la foto o la maqueta.
export function BotonExpandir({ abierta, onClick, className = "" }: { abierta: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={abierta ? "Cerrar pantalla completa" : "Ver en pantalla completa"}
      title={abierta ? "Cerrar (Esc)" : "Pantalla completa"}
      className={`bg-white/90 p-2.5 text-azul hover:bg-white ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {abierta ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />}
      </svg>
    </button>
  );
}
