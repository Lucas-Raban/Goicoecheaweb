import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { fotos } from "@/lib/fotos";
import { FormularioWhatsapp } from "@/components/FormularioWhatsapp";

export const metadata: Metadata = {
  title: "Tasación de propiedades en Mar del Plata",
  description:
    "Pedí la tasación de tu departamento, casa, local o terreno en Mar del Plata. Te decimos cuánto vale hoy, sin costo.",
  alternates: { canonical: "/tasaciones" },
};

const pasos = [
  { titulo: "Nos contás", texto: "Dirección, tipo de propiedad y lo que quieras que sepamos." },
  { titulo: "La visitamos", texto: "Coordinamos un día para verla en persona." },
  { titulo: "Te damos el valor", texto: "Con datos de operaciones reales de la zona y una estrategia para venderla o alquilarla." },
];

export default function Tasaciones() {
  return (
    <>
      <Encabezado etiqueta="Tasaciones" titulo="¿Cuánto vale tu propiedad?" foto={fotos.alquiler}>
        <p>Te decimos el valor real de tu propiedad hoy en Mar del Plata. La tasación no tiene costo.</p>
      </Encabezado>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold">Cómo trabajamos</h2>
          <ol className="mt-8 space-y-8">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-azul font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{p.titulo}</h3>
                  <p className="mt-1 text-gris">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-azul/5 ring-1 ring-borde md:p-10">
          <h2 className="font-serif text-2xl font-bold">Pedí tu tasación</h2>
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
    </>
  );
}
