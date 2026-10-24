import Link from "next/link";
import { site } from "@/lib/site";
import { JsonLd } from "./JsonLd";

// Ruta de navegación visible y su versión para Google (BreadcrumbList).
export function Migas({ items }: { items: { nombre: string; href: string }[] }) {
  const todos = [{ nombre: "Inicio", href: "/" }, ...items];
  return (
    <nav aria-label="Ruta" className="text-sm text-gris">
      <ol className="flex flex-wrap gap-x-2">
        {todos.map((item, i) => (
          <li key={item.href} className="flex gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < todos.length - 1 ? (
              <Link href={item.href} className="hover:underline">
                {item.nombre}
              </Link>
            ) : (
              <span className="text-azul">{item.nombre}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        datos={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: todos.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.nombre,
            item: `${site.url}${item.href === "/" ? "" : item.href}`,
          })),
        }}
      />
    </nav>
  );
}
