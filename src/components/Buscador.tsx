"use client";

import { useState } from "react";
import { barrios } from "@/lib/site";

const operaciones = [
  { valor: "venta", label: "Comprar" },
  { valor: "alquiler", label: "Alquilar" },
  { valor: "temporario", label: "Temporario" },
];

const tipos = ["Departamento", "Casa", "PH", "Local", "Terreno", "Galpón", "Campo"];

// Barra de búsqueda en una sola línea: operación, tipo, barrio y botón.
export function Buscador() {
  const [operacion, setOperacion] = useState("venta");

  return (
    <form action="/propiedades" className="bg-white text-azul shadow-[0_30px_60px_-20px_rgb(8_22_38/0.45)]">
      <input type="hidden" name="operacion" value={operacion} />
      <div className="grid lg:grid-cols-[auto_1fr_1fr_auto]">
        <div className="flex border-b border-borde lg:border-r lg:border-b-0" role="tablist" aria-label="Operación">
          {operaciones.map((op) => (
            <button
              key={op.valor}
              type="button"
              role="tab"
              aria-selected={operacion === op.valor}
              onClick={() => setOperacion(op.valor)}
              className={`flex-1 px-5 py-5 text-sm font-bold transition lg:flex-none ${
                operacion === op.valor ? "bg-azul text-white" : "text-gris hover:text-azul"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
        <Campo label="Tipo de propiedad" nombre="tipo" vacio="Todos" opciones={tipos} />
        <Campo label="Barrio" nombre="barrio" vacio="Toda la ciudad" opciones={barrios} borde />
        <button type="submit" className="group flex items-center justify-center gap-3 bg-azul px-8 py-5 text-sm font-bold text-white transition hover:bg-azul-claro">
          Buscar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-hover:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function Campo({ label, nombre, vacio, opciones, borde }: { label: string; nombre: string; vacio: string; opciones: string[]; borde?: boolean }) {
  return (
    <label className={`relative block border-b border-borde px-5 py-3 lg:border-b-0 ${borde ? "lg:border-l" : ""}`}>
      <span className="block text-xs text-gris">{label}</span>
      <select name={nombre} defaultValue="" className="w-full appearance-none bg-transparent pr-6 text-base font-bold outline-none">
        <option value="">{vacio}</option>
        {opciones.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-5 bottom-4 text-gris" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
