"use client";

import { useState } from "react";
import { barrios } from "@/lib/site";

const operaciones = [
  { valor: "venta", label: "Comprar" },
  { valor: "alquiler", label: "Alquilar" },
  { valor: "temporario", label: "Temporario" },
];

const tipos = ["Departamento", "Casa", "PH", "Local", "Terreno", "Galpón", "Campo"];

export function Buscador() {
  const [operacion, setOperacion] = useState("venta");

  const clasesCampo =
    "h-14 w-full appearance-none border border-borde bg-white px-4 text-sm text-azul outline-none focus:border-azul";

  return (
    <form action="/propiedades" className="bg-white text-azul shadow-lg">
      <input type="hidden" name="operacion" value={operacion} />
      <div className="flex border-b border-borde" role="tablist" aria-label="Operación">
        {operaciones.map((op) => (
          <button
            key={op.valor}
            type="button"
            role="tab"
            aria-selected={operacion === op.valor}
            onClick={() => setOperacion(op.valor)}
            className={`-mb-px flex-1 border-b-2 px-5 py-3.5 text-sm font-bold transition sm:flex-none ${
              operacion === op.valor ? "border-azul text-azul" : "border-transparent text-gris hover:text-azul"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Tipo de propiedad</span>
          <select name="tipo" defaultValue="" className={clasesCampo}>
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Flecha />
        </label>
        <label className="relative">
          <span className="sr-only">Barrio</span>
          <select name="barrio" defaultValue="" className={clasesCampo}>
            <option value="">Todos los barrios</option>
            {barrios.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <Flecha />
        </label>
        <button type="submit" className="flex h-14 items-center justify-center gap-2 bg-azul px-8 text-sm font-bold text-white transition hover:bg-azul-claro">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          Buscar
        </button>
      </div>
    </form>
  );
}

function Flecha() {
  return (
    <svg className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gris" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
