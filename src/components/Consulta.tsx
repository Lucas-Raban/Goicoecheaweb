import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";
import { FotoPerfil } from "@/components/FotoPerfil";
import { linkWhatsapp, type Asesor } from "@/lib/site";

// Caja de contacto de las fichas: botón de WhatsApp y formulario con el mensaje ya armado.
// Con asesor a cargo, la consulta va a su WhatsApp; si no, al de la inmobiliaria.
export function Consulta({ mensaje, detalle, asesor }: { mensaje: string; detalle: string; asesor?: Asesor }) {
  const whatsapp = asesor?.whatsapp;
  return (
    <div className="border border-borde p-6">
      <h2 className="font-serif text-2xl font-bold">¿Te interesa?</h2>
      <p className="mt-2 text-sm text-gris">{detalle}</p>
      {asesor && (
        <div className="mt-6 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-fondo">
            <FotoPerfil foto={asesor.foto} nombre={asesor.nombre} esLogo={asesor.esLogo} />
          </div>
          <div>
            <p className="text-sm text-gris">Te atiende</p>
            <p className="font-bold">{asesor.nombre}</p>
          </div>
        </div>
      )}
      <a
        href={linkWhatsapp(mensaje, whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block bg-whatsapp px-6 py-4 text-center font-bold text-white transition hover:brightness-95"
      >
        Consultar por WhatsApp
      </a>
      <div className="mt-6 border-t border-borde pt-6">
        <FormularioWhatsapp
          asunto={mensaje}
          boton="Enviar consulta"
          whatsapp={whatsapp}
          campos={[
            { nombre: "nombre", label: "Tu nombre", requerido: true },
            { nombre: "telefono", label: "Teléfono", tipo: "tel" },
            { nombre: "mensaje", label: "Consulta", tipo: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}
