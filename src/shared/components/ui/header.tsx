import { Menu } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import MobileNavMenu from "../MobileNavMenu";

export default function Header() {
  const links = [
    { text: 'Precios', path: '/precios' },
    { text: 'Funcionalidades', path: '/funcionalidades' },
    { text: 'Contacto', path: '/contacto' },

  ]
  return (
    <header className="sticky top-0 z-20">
      <div className="block w-full border-b border-input lg:hidden bg-[#FEFDFB]">
        <div className="h-16 px-6 flex justify-between items-center">
          <div className="w-30">
            <img
              src="/img/logo/surtio.svg"
              alt="Surtio Logo"
              className="w-full h-auto"
            />
          </div>
          <div className="">
            <MobileNavMenu />
          </div>
        </div>
      </div>
      <div className="hidden w-full border-b border-input lg:block bg-background">
        <div className="h-16">
          <nav className="relative w-full h-full flex items-center justify-between flex-1 max-w-6xl mx-auto px-6">
            <div className="w-30">
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
      </div>
    </header>
  )
}
