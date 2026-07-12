import { ArrowUpRight } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

export default function Header() {
  const links = [
    { text: 'Precios', path: '/precios' },
    { text: 'Funcionalidades', path: '/funcionalidades' },
    { text: 'Contacto', path: '/contacto' },

  ]
  return (
    <header className="sticky top-0 z-100 hidden w-full border-b border-input lg:block bg-background">
      <div className="h-16">
        <nav className="relative w-full h-full flex items-center justify-between flex-1 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1.5">
            <span>
              <ArrowUpRight />
            </span>
            <span className="text-xl font-semibold">Surtio</span>
          </div>

          <div className="absolute translate-x-1/2 right-1/2 h-full flex items-center gap-5">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.path}
                className="px-2.5 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              className="rounded-md"
              variant={'outline'}
              asChild
            >
              <Link href={'/auth/login'}>Inicia sesión</Link>
            </Button>
            <Button
              className="rounded-md bg-foreground text-background dark:hover:text-white"
              asChild
            >
              <Link href={'/admin'}>Demostración</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
