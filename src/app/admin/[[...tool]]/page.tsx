import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { sanityProjectId } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";

export default function Admin() {
  if (!sanityProjectId) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24">
        <h1 className="font-serif text-3xl font-bold">Panel sin conectar</h1>
        <p className="mt-4 text-gris">
          Falta configurar la variable NEXT_PUBLIC_SANITY_PROJECT_ID en Vercel con el ID del proyecto de Sanity.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
