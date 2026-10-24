"use client";

// Flechas para mover una tira horizontal en compu, donde no siempre se puede deslizar con el mouse.
export function BotonesDeslizar({ objetivo, fondo = "oscuro" }: { objetivo: string; fondo?: "oscuro" | "claro" }) {
  const mover = (sentido: number) => {
    const tira = document.getElementById(objetivo);
    tira?.scrollBy({ left: sentido * tira.clientWidth * 0.8, behavior: "smooth" });
  };
  const clases =
    fondo === "oscuro"
      ? "flex h-12 w-12 items-center justify-center border border-white/30 transition hover:border-white hover:bg-white hover:text-azul"
      : "flex h-12 w-12 items-center justify-center border border-borde text-azul transition hover:border-azul hover:bg-azul hover:text-white";
  return (
    <div className="hidden gap-2 md:flex">
      <button type="button" onClick={() => mover(-1)} aria-label="Anteriores" className={clases}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" onClick={() => mover(1)} aria-label="Siguientes" className={clases}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </div>
  );
}
