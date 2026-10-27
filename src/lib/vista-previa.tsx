import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

// Imagen que arma WhatsApp (y Facebook, Instagram, etc.) al compartir un link.
// WhatsApp pide JPG o PNG de menos de ~600 KB; un PNG con foto pesa más, así que se pasa a JPG.
export const tamanoVistaPrevia = { width: 1200, height: 630 };

type Datos = { foto?: string; antetitulo: string; titulo: string; precio?: string | null };

// Las fotos del panel salen del CDN de Sanity, que puede devolverlas ya recortadas y en JPG.
function fotoLiviana(url: string) {
  if (!url.startsWith("https://cdn.sanity.io/")) return url;
  return `${url.split("?")[0]}?w=1200&h=630&fit=crop&fm=jpg&q=80`;
}

export async function imagenVistaPrevia(datos: Datos) {
  try {
    return await armar(datos);
  } catch (error) {
    console.error("No se pudo armar la vista previa con la foto", datos.foto, error);
    // Si la foto no se pudo bajar, sale igual la placa con los datos sobre el azul de la marca.
    return armar({ ...datos, foto: undefined });
  }
}

async function armar({ foto, antetitulo, titulo, precio }: Datos) {
  const [logo, fuente] = await Promise.all([
    readFile(join(process.cwd(), "public/marca/logo-blanco.png")),
    readFile(join(process.cwd(), "public/marca/fuentes/Montserrat-Bold.ttf")),
  ]);
  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0d233c", fontFamily: "Montserrat" }}>
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoLiviana(foto)} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            padding: "28px 48px",
            background: "#0d233c",
            color: "white",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 24, opacity: 0.75 }}>{antetitulo}</div>
            <div style={{ marginTop: 6, fontSize: 40, lineHeight: 1.15 }}>{titulo}</div>
          </div>
          {precio && <div style={{ fontSize: 48, whiteSpace: "nowrap", flexShrink: 0 }}>{precio}</div>}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          width={300}
          height={65}
          alt=""
          style={{ position: "absolute", top: 32, left: 40, padding: "14px 18px", background: "#0d233c" }}
        />
      </div>
    ),
    { ...tamanoVistaPrevia, fonts: [{ name: "Montserrat", data: fuente, weight: 700 }] },
  );
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
