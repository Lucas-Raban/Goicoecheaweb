"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { linkWhatsapp, navegacion, site } from "@/lib/site";

// Las fichas no tienen foto de portada arriba: ahí el encabezado es blanco desde el principio.
const esFicha = (ruta: string) => /^\/(propiedades|emprendimientos)\/[^/]+/.test(ruta);

// Transparente sobre la foto de portada; se vuelve blanco al hacer scroll. Las secciones se ven como solapas.
export function Header() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 40);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  const claro = (scrolleado || esFicha(ruta)) && !abierto;
  const activa = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        claro ? "border-b border-borde bg-white" : "border-b border-white/25 bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 md:px-8 ${claro ? "h-18" : "h-24"}`}>
        <Link href="/" aria-label={`${site.nombre}, inicio`} onClick={() => setAbierto(false)} className="relative z-50 shrink-0">
          <Image
            src={claro ? "/marca/logo-azul.png" : "/marca/logo-blanco.png"}
            alt={site.nombre}
            width={260}
            height={56}
            priority
            className="w-[230px] xl:w-[260px]"
          />
        </Link>

        <nav className="hidden h-full items-end gap-1 font-titulo lg:flex" aria-label="Principal">
          {navegacion.map((item) => {
            const actual = activa(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={actual ? "page" : undefined}
                className={`-mb-px rounded-t-md border border-b-0 px-3 py-2.5 text-[13px] font-bold transition-colors xl:text-sm ${
                  claro
                    ? actual
                      ? "border-borde bg-white text-azul shadow-[inset_0_2px_0_var(--color-azul)]"
                      : "border-transparent bg-fondo text-gris hover:border-borde hover:bg-white hover:text-azul"
                    : actual
                      ? "border-white bg-white text-azul"
                      : "border-white/25 bg-azul/30 text-white hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div
            className={`ml-3 hidden self-center border-l pl-4 text-xs leading-snug whitespace-nowrap xl:block 2xl:pl-5 2xl:text-[13px] ${claro ? "border-borde text-azul" : "border-white/30 text-white"}`}
          >
            <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Tel: <span className="font-bold">{site.telefono}</span>
            </a>
            <a href={`mailto:${site.email}`} className="block hover:underline">
              Mail: <span className="font-bold">{site.email}</span>
            </a>
          </div>
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
        <nav id="menu-movil" className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-azul px-6 pt-28 pb-10 lg:hidden" aria-label="Principal">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activa(item.href) ? "page" : undefined}
              className={`border-b border-white/10 py-4 font-titulo text-3xl font-bold ${activa(item.href) ? "text-white" : "text-white/75"}`}
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
