"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { linkWhatsapp, navegacion, site } from "@/lib/site";

// Transparente sobre la foto de portada; se vuelve blanco al hacer scroll.
export function Header() {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const alScrollear = () => setSolido(window.scrollY > 40);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  const claro = solido && !abierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        claro ? "bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.06)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 md:px-8 ${claro ? "h-18" : "h-24"}`}>
        <Link href="/" aria-label={`${site.nombre}, inicio`} onClick={() => setAbierto(false)} className="relative z-50">
          <Image
            src={claro ? "/marca/logo-azul.png" : "/marca/logo-blanco.png"}
            alt={site.nombre}
            width={210}
            height={45}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-bold underline-offset-8 transition hover:underline ${
                claro ? "text-azul" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-4 border-l pl-6 text-sm font-bold ${claro ? "border-borde text-azul" : "border-white/30 text-white"}`}
          >
            {site.telefono}
          </a>
        </nav>

        <button
          type="button"
          className={`relative z-50 flex h-11 w-11 items-center justify-center lg:hidden ${claro ? "text-azul" : "text-white"}`}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" className="fixed inset-0 bg-azul z-40 flex flex-col px-6 pt-32 pb-10 lg:hidden" aria-label="Principal">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-white/10 py-5 font-serif text-4xl font-bold text-white"
              onClick={() => setAbierto(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={linkWhatsapp("Hola, te escribo desde la web.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto bg-white py-4 text-center font-bold text-azul"
          >
            Escribinos por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
