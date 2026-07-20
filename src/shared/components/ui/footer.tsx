import { Monitor, Moon, Sun } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const legalLinks = [
    { text: 'Políticas y Privacidad', path: '/legal/privacy' },
    { text: 'Términos y Condiciones', path: '/legal/conditions' },
    { text: 'Seguridad', path: '/legal/security' },
  ]
  const resourceLinks = [
    { text: 'Centro de ayuda', path: '/help' },
    { text: 'Blog', path: '/blog' },
    { text: 'Precios', path: '/pricing' },
    { text: 'Precios', path: '/pricing' },
    { text: 'Guías', path: '/guides' },
    { text: 'Características', path: '/features' },
  ]
  const featuresLinks = [
    { text: 'Ventas', path: '/features/sales' },
    { text: 'Inventario', path: '/features/stock' },
    { text: 'Proveedores', path: '/features/suppliers' },
    { text: 'Reportes', path: '/features/reports' },
    { text: 'Usuarios', path: '/features/users' },
  ]
  return (
    <footer className="border-t-0.5 border-input/60">
      <div className="max-w-6xl px-4 mx-auto pt-20 pb-6">
        <div className="grid grid-cols-24 gap-3 border-b border-input/60 pb-12">
          <div className="col-span-5">
            <Link href={'/'} className="block w-26">
              <img
                src="/img/logo/surtio.svg"
                alt="Surtio Logo"
                className="w-full h-auto"
              />
            </Link>
          </div>
          <div className="col-span-19 grid grid-cols-4 gap-5">
            <div className="flex flex-col gap-6 col-start-2">
              <h3 className="text-sm text-muted-foreground">Funcionalidades</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {featuresLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.path}
                      className="py-1.5 font-medium hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6 col-start-3">
              <h3 className="text-sm text-muted-foreground">Recursos</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {resourceLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.path}
                      className="py-1.5 font-medium hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6 col-start-4">
              <h3 className="text-sm text-muted-foreground">Legal</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.path}
                      className="py-1.5 font-medium hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <button className="p-1 border border-muted rounded-md">
              <Sun className="size-4.5 fill-black opacity-60 hover:opacity-100 transition-opacity" />
            </button>
            <button className="p-1">
              <Moon className="size-4.5 opacity-60 hover:opacity-100 transition-opacity" />
            </button>
            <button className="p-1">
              <Monitor className="size-4.5 opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">Copyright Surtio &copy; 2026</p>
        </div>
      </div>
    </footer>
  )
}
