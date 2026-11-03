"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type ConPrefijo = HTMLElement & { webkitRequestFullscreen?: () => void };
type DocumentoConPrefijo = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };

const elementoCompleto = () => document.fullscreenElement ?? (document as DocumentoConPrefijo).webkitFullscreenElement ?? null;

// Agranda una foto o la maqueta a pantalla completa de verdad (sin barras del navegador).
// En el iPhone, que no deja hacerlo, queda ocupando toda la ventana.
// Escape, el botón atrás del celular o la X la cierran, y la página de atrás no se desplaza.
export function usePantallaCompleta<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [abierta, setAbierta] = useState(false);

  // Se pide desde el mismo toque: el navegador solo deja pasar a pantalla completa así.
  const abrir = useCallback(() => {
    flushSync(() => setAbierta(true));
    const el = ref.current as ConPrefijo | null;
    try {
      if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
      else el?.webkitRequestFullscreen?.();
    } catch {}
  }, []);

  const cerrar = useCallback(() => {
    setAbierta(false);
    const doc = document as DocumentoConPrefijo;
    if (!elementoCompleto()) return;
    if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
    else doc.webkitExitFullscreen?.();
  }, []);

  useEffect(() => {
    if (!abierta) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    // Si se sale con la tecla o el gesto del sistema, se cierra también la vista agrandada.
    const cambio = () => !elementoCompleto() && setAbierta(false);
    const desborde = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    document.addEventListener("fullscreenchange", cambio);
    document.addEventListener("webkitfullscreenchange", cambio);
    return () => {
      document.body.style.overflow = desborde;
      window.removeEventListener("keydown", tecla);
      document.removeEventListener("fullscreenchange", cambio);
      document.removeEventListener("webkitfullscreenchange", cambio);
    };
  }, [abierta, cerrar]);

  return { ref, abierta, abrir, cerrar };
}

// Botón de expandir / cerrar, en la esquina de la foto o la maqueta.
export function BotonExpandir({ abierta, onClick, className = "" }: { abierta: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={abierta ? "Cerrar pantalla completa" : "Ver en pantalla completa"}
      title={abierta ? "Cerrar (Esc)" : "Pantalla completa"}
      className={`flex items-center gap-2 bg-white/90 p-2.5 text-sm font-bold text-azul hover:bg-white ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {abierta ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />}
      </svg>
      {!abierta && <span className="hidden pr-1 sm:inline">Pantalla completa</span>}
    </button>
  );
}
