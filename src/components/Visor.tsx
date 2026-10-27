"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

// Capa a pantalla completa sobre fondo azul noche. Se cierra con la X, con Esc o tocando el fondo.
export function Visor({
  titulo,
  alCerrar,
  alMover,
  children,
}: {
  titulo: string;
  alCerrar: () => void;
  alMover?: (paso: number) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "Escape") alCerrar();
      if (alMover && e.key === "ArrowLeft") alMover(-1);
      if (alMover && e.key === "ArrowRight") alMover(1);
    };
    window.addEventListener("keydown", teclas);
    const desborde = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", teclas);
      document.body.style.overflow = desborde;
    };
  }, [alCerrar, alMover]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={titulo} className="fixed inset-0 z-[100] flex flex-col bg-azul-noche" onClick={alCerrar}>
      <div className="flex shrink-0 justify-end">
        <button type="button" onClick={alCerrar} aria-label="Cerrar" autoFocus className="p-4 text-white hover:bg-white/10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && alCerrar()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

// Detecta un deslizamiento horizontal con el dedo y lo traduce a anterior (-1) o siguiente (1).
export function deslizar(alMover: (paso: number) => void) {
  let inicio: { x: number; y: number } | null = null;
  return {
    onTouchStart: (e: React.TouchEvent) => {
      inicio = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!inicio) return;
      const dx = e.changedTouches[0].clientX - inicio.x;
      const dy = e.changedTouches[0].clientY - inicio.y;
      inicio = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) alMover(dx < 0 ? 1 : -1);
    },
  };
}
