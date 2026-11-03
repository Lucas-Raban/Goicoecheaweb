import Image from "next/image";
import Link from "next/link";
import { avisoLegal, linkWhatsapp, navegacion, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="fondo-lineas mt-auto bg-azul-noche text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 py-14 md:grid-cols-3">
        <div>
          <Image src="/marca/logo-blanco.png" alt={site.nombre} width={290} height={63} className="w-[290px] max-w-full" />
          <p className="mt-5 text-sm text-white/75">
            Inmobiliaria en Mar del Plata. Venta, alquiler y alquiler temporario.
          </p>
        </div>

        <div>
          <p className="etiqueta text-white/60">Contacto</p>
          <address className="mt-4 space-y-2 text-sm not-italic">
            <p>
              {site.direccion.calle}, {site.direccion.ciudad}
            </p>
            <p>
              <a href={linkWhatsapp()} className="hover:underline">
                WhatsApp {site.telefono}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </p>
          </address>
          <div className="mt-4 flex gap-4 text-sm">
            <a href={site.redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
            <a href={site.redes.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Facebook
            </a>
          </div>
        </div>

        <div>
          <p className="etiqueta text-white/60">Secciones</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[...navegacion, { href: "/barrios", label: "Barrios" }, { href: "/propiedades", label: "Todas las propiedades" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 text-xs text-white/55">
          <p>{avisoLegal}</p>
          <p className="mt-3">
            © {site.nombre} · {site.registro}
          </p>
        </div>
      </div>
    </footer>
  );
}
