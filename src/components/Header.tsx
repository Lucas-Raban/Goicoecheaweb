"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navegacion, site } from "@/lib/site";

export function Header() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label={`${site.nombre}, inicio`} onClick={() => setAbierto(false)}>
          <Image src="/marca/logo-azul.png" alt={site.nombre} width={232} height={50} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navegacion.map((item) => (
            <Link key={item.href} href={item.href} className="etiqueta text-azul hover:text-gris">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" className="border-t border-borde bg-white md:hidden" aria-label="Principal">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="etiqueta block border-b border-borde px-4 py-4 text-azul"
              onClick={() => setAbierto(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
