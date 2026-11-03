"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_AMBIENTES, type Filtros } from "@/lib/filtros";
import type { Moneda, Operacion } from "@/lib/propiedad";
import { barrios } from "@/lib/site";

const operaciones: { valor: Operacion; label: string }[] = [
  { valor: "venta", label: "Comprar" },
  { valor: "alquiler", label: "Alquilar" },
  { valor: "temporario", label: "Temporario" },
];

const tipos = ["Departamento", "Casa", "PH", "Local", "Terreno", "Galpón", "Campo"];

const ambientes = Array.from({ length: MAX_AMBIENTES }, (_, i) => ({
  valor: String(i + 1),
  label: i === 0 ? "Monoambiente" : i + 1 === MAX_AMBIENTES ? `${i + 1} o más` : String(i + 1),
}));
const minimos = (hasta: number) => Array.from({ length: hasta }, (_, i) => ({ valor: String(i + 1), label: `${i + 1} o más` }));

const numericos = ["precioMin", "precioMax", "expensasMax", "superficieMin"];

const monedaDe = (op: Operacion): Moneda => (op === "venta" ? "USD" : "ARS");
const miles = (n: number | null | undefined) => (n ? n.toLocaleString("es-AR") : "");

// Barra de búsqueda: operación, tipo, barrio y botón en una línea, y el resto de los filtros
// (ambientes, precio, expensas...) en "Más filtros". Ningún campo es obligatorio.
export function Buscador({ inicial }: { inicial?: Filtros }) {
  const [operacion, setOperacion] = useState<Operacion>(inicial?.operacion ?? "venta");
  const [moneda, setMoneda] = useState<Moneda>(inicial?.moneda ?? "USD");
  const extras = Boolean(
    inicial &&
      (inicial.ambientes || inicial.dormitorios || inicial.banos || inicial.cochera || inicial.precioMin || inicial.precioMax || inicial.expensasMax || inicial.superficieMin),
  );
  const [abierto, setAbierto] = useState(extras);
  const form = useRef<HTMLFormElement>(null);

  // Saca de la dirección los campos vacíos, para que quede ?operacion=venta&ambientes=3 y no una lista de "=".
  useEffect(() => {
    const el = form.current;
    if (!el) return;
    const limpiar = (e: FormDataEvent) => {
      for (const [nombre, valor] of [...e.formData.entries()]) {
        if (valor === "") e.formData.delete(nombre);
        // 150.000 → 150000
        else if (numericos.includes(nombre)) e.formData.set(nombre, String(valor).replace(/\D/g, ""));
      }
      if (!e.formData.has("precioMin") && !e.formData.has("precioMax")) e.formData.delete("moneda");
    };
    el.addEventListener("formdata", limpiar);
    return () => el.removeEventListener("formdata", limpiar);
  }, []);

  function elegirOperacion(op: Operacion) {
    setOperacion(op);
    setMoneda(monedaDe(op));
  }

  return (
    <form ref={form} action="/propiedades" className="bg-white text-azul shadow-[0_30px_60px_-20px_rgb(8_22_38/0.45)]">
      <input type="hidden" name="operacion" value={operacion} />
      <input type="hidden" name="moneda" value={moneda} />
      <div className="grid lg:grid-cols-[auto_1fr_1fr_auto]">
        <div className="flex border-b border-borde lg:border-r lg:border-b-0" role="tablist" aria-label="Operación">
          {operaciones.map((op) => (
            <button
              key={op.valor}
              type="button"
              role="tab"
              aria-selected={operacion === op.valor}
              onClick={() => elegirOperacion(op.valor)}
              className={`flex-1 px-5 py-5 text-sm font-bold transition lg:flex-none ${
                operacion === op.valor ? "bg-azul text-white" : "text-gris hover:text-azul"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
        <Campo label="Tipo de propiedad" nombre="tipo" vacio="Todos" opciones={tipos} inicial={inicial?.tipo} className="border-b lg:border-b-0" />
        <Campo label="Barrio" nombre="barrio" vacio="Toda la ciudad" opciones={barrios} inicial={inicial?.barrio} className="border-b lg:border-b-0 lg:border-l" />

        <div className="lg:order-last lg:col-span-4 lg:border-t lg:border-borde">
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls="mas-filtros"
            onClick={() => setAbierto(!abierto)}
            className="flex w-full items-center px-5 py-3 text-sm font-bold text-gris transition hover:text-azul"
          >
            {abierto ? "Menos filtros" : "Más filtros"}
            {!abierto && <span className="ml-1.5 truncate font-normal">(ambientes, precio, expensas)</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`ml-auto shrink-0 transition lg:ml-2 ${abierto ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div id="mas-filtros" hidden={!abierto} className="grid grid-cols-2 gap-px border-t border-borde bg-borde lg:grid-cols-4">
            <Campo label="Ambientes" nombre="ambientes" vacio="Indistinto" opciones={ambientes} inicial={inicial?.ambientes} className="bg-white" />
            <Campo label="Dormitorios" nombre="dormitorios" vacio="Indistinto" opciones={minimos(4)} inicial={inicial?.dormitorios} className="bg-white" />
            <div className="col-span-2 flex bg-white">
              <div className="flex flex-col justify-end py-3 pr-3 pl-5 lg:pr-5">
                <span className="block text-xs text-gris">Precio</span>
                <div className="mt-1 flex border border-borde text-sm font-bold" role="group" aria-label="Moneda del precio">
                  {(["USD", "ARS"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={moneda === m}
                      onClick={() => setMoneda(m)}
                      className={`px-3 py-1 transition ${moneda === m ? "bg-azul text-white" : "text-gris hover:text-azul"}`}
                    >
                      {m === "USD" ? "USD" : "$"}
                    </button>
                  ))}
                </div>
              </div>
              <Numero label="Desde" nombre="precioMin" inicial={inicial?.precioMin} className="min-w-0 flex-1 border-l border-borde !px-3 lg:!px-5" />
              <Numero label="Hasta" nombre="precioMax" inicial={inicial?.precioMax} className="min-w-0 flex-1 border-l border-borde !px-3 lg:!px-5" />
            </div>
            <Numero label="Expensas hasta ($)" nombre="expensasMax" inicial={inicial?.expensasMax} className="bg-white" />
            <Campo label="Baños" nombre="banos" vacio="Indistinto" opciones={minimos(3)} inicial={inicial?.banos} className="bg-white" />
            <Numero label="Superficie desde (m²)" nombre="superficieMin" inicial={inicial?.superficieMin} className="bg-white" />
            <label className="flex cursor-pointer items-center gap-3 bg-white px-5 py-3 text-base font-bold">
              <input type="checkbox" name="cochera" value="si" defaultChecked={inicial?.cochera} className="size-4 accent-azul" />
              Con cochera
            </label>
          </div>
        </div>

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

type Opcion = string | { valor: string; label: string };

function Campo({
  label,
  nombre,
  vacio,
  opciones,
  inicial,
  className = "",
}: {
  label: string;
  nombre: string;
  vacio: string;
  opciones: Opcion[];
  inicial?: string | number | null;
  className?: string;
}) {
  return (
    <label className={`relative block border-borde px-5 py-3 ${className}`}>
      <span className="block text-xs text-gris">{label}</span>
      <select name={nombre} defaultValue={inicial ? String(inicial) : ""} className="w-full appearance-none bg-transparent pr-6 text-base font-bold outline-none">
        <option value="">{vacio}</option>
        {opciones.map((o) =>
          typeof o === "string" ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ),
        )}
      </select>
      <svg className="pointer-events-none absolute right-5 bottom-4 text-gris" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}

function Numero({ label, nombre, inicial, className = "" }: { label: string; nombre: string; inicial?: number | null; className?: string }) {
  return (
    <label className={`block px-5 py-3 ${className}`}>
      <span className="block truncate text-xs text-gris">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        name={nombre}
        defaultValue={miles(inicial)}
        placeholder="Sin límite"
        onChange={(e) => {
          // Muestra los puntos de miles mientras se escribe: 150000 → 150.000
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          e.target.value = Number.isFinite(n) ? n.toLocaleString("es-AR") : "";
        }}
        className="w-full bg-transparent text-base font-bold outline-none placeholder:font-normal placeholder:text-gris/60"
      />
    </label>
  );
}
