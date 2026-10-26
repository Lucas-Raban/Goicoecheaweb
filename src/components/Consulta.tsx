import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";
import { linkWhatsapp } from "@/lib/site";

// Caja de contacto de las fichas: botón de WhatsApp y formulario con el mensaje ya armado.
export function Consulta({ mensaje, detalle }: { mensaje: string; detalle: string }) {
  return (
    <div className="border border-borde p-6">
      <h2 className="font-serif text-2xl font-bold">¿Te interesa?</h2>
      <p className="mt-2 text-sm text-gris">{detalle}</p>
      <a
        href={linkWhatsapp(mensaje)}
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
