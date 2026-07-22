import Link from "next/link"
import ThemeButtons from "./theme-buttons"

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
    <footer className="border-t border-input/60">
      <div className="max-w-6xl px-4 mx-auto pt-18 pb-14">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-24 lg:gap-3 border-b border-input/60 pb-12">
          <div className="lg:col-span-5">
            <Link href={'/'} className="block w-26">
              <img
                src="/img/logo/surtio.svg"
                alt="Surtio Logo"
                className="w-full h-auto block dark:hidden"
              />
              <img
                src="/img/logo/surtio-dark.svg"
                alt="Surtio Logo"
                className="w-full h-auto hidden dark:block"
              />
            </Link>
          </div>
          <div className="lg:col-span-19 grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex flex-col gap-6 lg:col-start-2">
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
            <div className="flex flex-col gap-6 lg:col-start-3">
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
            <div className="flex flex-col gap-6 lg:col-start-4">
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
          <ThemeButtons />
          <p className="text-sm text-muted-foreground">Copyright Surtio &copy; 2026</p>
        </div>
      </div>
    </footer>
  )
}
