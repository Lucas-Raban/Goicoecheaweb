import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Imagen que se ve al compartir la web en WhatsApp, Facebook, etc. Las fichas usan la foto de la propiedad.
export const alt = "Goicoechea Propiedades, inmobiliaria en Mar del Plata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/marca/logo-blanco.png"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d233c",
          color: "white",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={640} height={138} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>Inmobiliaria en Mar del Plata</div>
          <div style={{ marginTop: 20, fontSize: 32, opacity: 0.75 }}>Venta · Alquiler · Alquiler temporario · Tasaciones</div>
          <div style={{ marginTop: 12, fontSize: 28, opacity: 0.6 }}>Alberti 1550, local 1 · 223 511-1816</div>
        </div>
      </div>
    ),
    size,
  );
}
