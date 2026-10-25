import { metadataTipo, PaginaTipo, parametrosTipos } from "@/components/PaginaTipo";

export const generateStaticParams = parametrosTipos;

export async function generateMetadata({ params }: PageProps<"/alquiler/[tipo]">) {
  return metadataTipo("alquiler", (await params).tipo);
}

export default async function Page({ params }: PageProps<"/alquiler/[tipo]">) {
  return <PaginaTipo operacion="alquiler" slug={(await params).tipo} />;
}
