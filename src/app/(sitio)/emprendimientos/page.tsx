import type { Metadata } from "next";
import { Encabezado } from "@/components/Encabezado";
import { Migas } from "@/components/Migas";
import { SinPropiedades } from "@/components/SinPropiedades";
import { TarjetaEmprendimiento } from "@/components/TarjetaEmprendimiento";
import { getEmprendimientos } from "@/lib/emprendimientos";
import { fotos } from "@/lib/fotos";
import { getPropiedades } from "@/lib/propiedades";

export const metadata: Metadata = {
  title: "Emprendimientos en pozo y en construcción en Mar del Plata",
  description:
    "Departamentos en pozo y en construcción en Mar del Plata: estado de obra, fecha de entrega, unidades disponibles y formas de pago.",
  alternates: { canonical: "/emprendimientos" },
};

export default async function Emprendimientos() {
  const [emprendimientos, propiedades] = await Promise.all([getEmprendimientos(), getPropiedades()]);

  return (
    <>
      <Encabezado etiqueta="Emprendimientos" titulo="Edificios en pozo y en construcción" foto={fotos.alquiler}>
        <p>
          Comprar en pozo te permite entrar con un anticipo y pagar el resto en cuotas mientras avanza la obra. En cada
          ficha vas a ver el estado, la fecha de entrega estimada y las unidades que quedan.
        </p>
      </Encabezado>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <Migas items={[{ nombre: "Emprendimientos", href: "/emprendimientos" }]} />
        <div className="mt-10">
          {emprendimientos.length > 0 ? (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {emprendimientos.map((e, i) => (
                <TarjetaEmprendimiento
                  key={e.id}
                  e={e}
                  unidades={propiedades.filter((p) => p.emprendimiento === e.id).length}
                  prioridad={i < 3}
                />
              ))}
            </div>
          ) : (
            <SinPropiedades
              titulo="Estamos sumando los emprendimientos a la web"
              mensaje="Si buscás un departamento en pozo o en construcción, escribinos y te contamos qué obras tenemos, en qué etapa están y cómo se paga cada una."
            />
          )}
        </div>
      </section>
    </>
  );
}
