import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { JsonLd } from "@/components/JsonLd";
import { fotos } from "@/lib/fotos";
import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";

export const metadata: Metadata = {
  title: "Tasación de propiedades en Mar del Plata",
  description:
    "Pedí la tasación de tu departamento, casa, local o terreno en Mar del Plata. Te decimos cuánto vale hoy, sin costo.",
  alternates: { canonical: "/tasaciones" },
};


const preguntas = [
  {
    pregunta: "¿La tasación tiene costo?",
    respuesta: "No. La tasación es sin cargo y no te compromete a vender ni a alquilar con nosotros.",
  },
  {
    pregunta: "¿Cuánto tarda?",
    respuesta: "Coordinamos la visita en pocos días y después te pasamos el valor con la explicación de cómo lo calculamos.",
  },
  {
    pregunta: "¿Por qué hace falta ver la propiedad?",
    respuesta: "El estado, la luz, la vista, la orientación y las expensas cambian mucho el precio, y nada de eso se ve bien en fotos.",
  },
  {
    pregunta: "¿Tasan locales, terrenos y campos?",
    respuesta: "Sí. Tasamos departamentos, casas, PH, locales, terrenos, galpones y campos en Mar del Plata y alrededores.",
  },
];

export default function Tasaciones() {
  return (
    <>
      <Encabezado etiqueta="Tasaciones" titulo="¿Cuánto vale tu propiedad?" foto={fotos.alquiler}>
        <p>Te decimos el valor real de tu propiedad hoy en Mar del Plata. La tasación no tiene costo.</p>
      </Encabezado>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-titulo text-2xl font-bold">Cómo es la tasación</h2>
          <div className="mt-6 space-y-4 text-gris">
            <p>
              Contanos la dirección y qué tipo de propiedad es. Coordinamos un día para ir a verla, porque el estado, la
              luz y la vista cambian mucho el precio y no se ven en una foto.
            </p>
            <p>
              Con eso y los valores de operaciones cerradas en la zona te pasamos un precio realista, y te explicamos cómo
              lo calculamos. Si después querés venderla o alquilarla con nosotros, también te contamos cómo la
              publicaríamos.
            </p>
            <p>La tasación no tiene costo y no te compromete a nada.</p>
          </div>
        </div>

        <div className="border border-borde bg-white p-6 md:p-10">
          <h2 className="font-titulo text-2xl font-bold">Pedí tu tasación</h2>
          <div className="mt-6">
            <FormularioWhatsapp
              asunto="Quiero tasar mi propiedad."
              boton="Pedir tasación"
              campos={[
                { nombre: "nombre", label: "Tu nombre", requerido: true },
                { nombre: "telefono", label: "Teléfono", tipo: "tel", requerido: true },
                { nombre: "direccion", label: "Dirección de la propiedad", requerido: true },
                { nombre: "tipo", label: "Tipo de propiedad (depto, casa, local...)" },
                { nombre: "mensaje", label: "Algo más que quieras contarnos", tipo: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-borde bg-fondo">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="font-titulo text-3xl font-bold md:text-4xl">Preguntas frecuentes</h2>
          <div className="mt-10 grid gap-x-12 md:grid-cols-2">
            {preguntas.map((p) => (
              <div key={p.pregunta} className="border-t border-borde py-6">
                <h3 className="font-bold">{p.pregunta}</h3>
                <p className="mt-2 text-gris">{p.respuesta}</p>
              </div>
            ))}
          </div>
        </div>
        <JsonLd
          datos={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: preguntas.map((p) => ({
              "@type": "Question",
              name: p.pregunta,
              acceptedAnswer: { "@type": "Answer", text: p.respuesta },
            })),
          }}
        />
      </section>
    </>
  );
}
