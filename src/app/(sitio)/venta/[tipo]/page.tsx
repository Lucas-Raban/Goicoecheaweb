import { metadataTipo, PaginaTipo, parametrosTipos } from "@/components/PaginaTipo";

export const generateStaticParams = parametrosTipos;

export async function generateMetadata({ params }: PageProps<"/venta/[tipo]">) {
  return metadataTipo("venta", (await params).tipo);
}

export default async function Page({ params }: PageProps<"/venta/[tipo]">) {
  return <PaginaTipo operacion="venta" slug={(await params).tipo} />;
}
