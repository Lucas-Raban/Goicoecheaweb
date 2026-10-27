"use client";

import { useState } from "react";
import { linkWhatsapp } from "@/lib/site";

type Campo = { nombre: string; label: string; tipo?: "text" | "tel" | "email" | "textarea"; requerido?: boolean };

// Por ahora el formulario arma un mensaje y abre WhatsApp. En el paso 3 se conecta a email/CRM.
export function FormularioWhatsapp({
  asunto,
  campos,
  boton = "Enviar por WhatsApp",
  whatsapp,
}: {
  asunto: string;
  campos: Campo[];
  boton?: string;
  whatsapp?: string;
}) {
  const [valores, setValores] = useState<Record<string, string>>({});

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const lineas = campos
      .filter((c) => valores[c.nombre]?.trim())
      .map((c) => `${c.label}: ${valores[c.nombre].trim()}`);
    const mensaje = [`Hola, te escribo desde la web. ${asunto}`, "", ...lineas].join("\n");
    window.open(linkWhatsapp(mensaje, whatsapp), "_blank", "noopener,noreferrer");
  }

  const clasesInput =
    "mt-1 w-full border border-borde bg-white px-4 py-3 focus:border-azul text-base text-azul outline-none";

  return (
    <form onSubmit={enviar} className="space-y-4">
      {campos.map((c) => (
        <label key={c.nombre} className="block">
          <span className="text-sm font-bold">
            {c.label}
            {c.requerido && <span className="text-gris"> *</span>}
          </span>
          {c.tipo === "textarea" ? (
            <textarea
              name={c.nombre}
              required={c.requerido}
              rows={4}
              className={clasesInput}
              onChange={(e) => setValores((v) => ({ ...v, [c.nombre]: e.target.value }))}
            />
          ) : (
            <input
              name={c.nombre}
              type={c.tipo ?? "text"}
              required={c.requerido}
              className={clasesInput}
              onChange={(e) => setValores((v) => ({ ...v, [c.nombre]: e.target.value }))}
            />
          )}
        </label>
      ))}
      <button type="submit" className="w-full bg-azul px-8 py-4 font-bold text-white transition hover:bg-azul-claro sm:w-auto">
        {boton}
      </button>
    </form>
  );
}
