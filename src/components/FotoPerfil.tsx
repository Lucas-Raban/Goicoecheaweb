import Image from "next/image";

export function FotoPerfil({ foto, nombre }: { foto?: string; nombre: string }) {
  if (foto) {
    return <Image src={foto} alt={nombre} fill sizes="112px" className="object-cover object-top" />;
  }
  const iniciales = nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-bold text-gris">{iniciales}</span>;
}
