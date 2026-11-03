import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { fotos } from "@/lib/fotos";
import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a Goicoechea Propiedades en Mar del Plata: WhatsApp, email o pasá por Alberti 1550, local 1.",
  alternates: { canonical: "/contacto" },
};

export default function Contacto() {
  return (
    <>
      <Encabezado etiqueta="Contacto" titulo="Hablemos" foto={fotos.temporario}>
        <p>Si querés ver una propiedad, vender la tuya o tenés alguna duda, mandanos un mensaje y lo charlamos.</p>
      </Encabezado>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 py-20 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="etiqueta text-gris">WhatsApp</h2>
            <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xl font-bold hover:underline">
              {site.telefono}
            </a>
          </div>
          <div>
            <h2 className="etiqueta text-gris">Email</h2>
            <a href={`mailto:${site.email}`} className="mt-2 block text-xl font-bold break-all hover:underline">
              {site.email}
            </a>
          </div>
          <div>
            <h2 className="etiqueta text-gris">Oficina</h2>
            <p className="mt-2 text-xl font-bold">
              {site.direccion.calle}
              <br />
              {site.direccion.ciudad}, {site.direccion.provincia}
            </p>
          </div>
          <iframe
            title="Mapa de la oficina de Goicoechea Propiedades"
            src="https://www.google.com/maps?q=Alberti+1550,+Mar+del+Plata&output=embed"
            className="h-72 w-full border border-borde"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="border border-borde bg-white p-6 md:p-10">
          <h2 className="font-titulo text-2xl font-bold">Escribinos</h2>
          <div className="mt-6">
            <FormularioWhatsapp
              asunto="Quiero hacer una consulta."
              campos={[
                { nombre: "nombre", label: "Tu nombre", requerido: true },
                { nombre: "telefono", label: "Teléfono", tipo: "tel" },
                { nombre: "mensaje", label: "Tu consulta", tipo: "textarea", requerido: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
