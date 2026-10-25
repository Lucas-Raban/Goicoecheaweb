import { metadataTipo, PaginaTipo, parametrosTipos } from "@/components/PaginaTipo";

export const generateStaticParams = parametrosTipos;

export async function generateMetadata({ params }: PageProps<"/alquiler-temporario/[tipo]">) {
  return metadataTipo("temporario", (await params).tipo);
}

export default async function Page({ params }: PageProps<"/alquiler-temporario/[tipo]">) {
  return <PaginaTipo operacion="temporario" slug={(await params).tipo} />;
}
