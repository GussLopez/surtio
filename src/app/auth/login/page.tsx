import LoginForm from "@/features/auth/components/LoginForm"
import { GeneratePageTitle } from "@/shared/utils/metadata"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: GeneratePageTitle('Iniciar Sesión')
}

export default function Login() {
  
  return (
    <div className="min-h-screen relative">
      <div className="max-w-104 3xl:min-h-screen 3xl:flex 3xl:flex-col 3xl:justify-center mx-auto p-10 col-span-8">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-10">
            <Image
              src={'/img/logo/flyzzio-light.svg'}
              className="hidden dark:block"
              alt="Flyzzio Logo"
              width={30}
              height={30}
            />
            <Image
              src={'/img/logo/flyzzio.svg'}
              className="block dark:hidden"
              alt="Flyzzio Logo"
              width={30}
              height={30}
            />
          </div>
          <h1 className="mb-1 text-3xl font-semibold">Bienvenido a Flyzzio</h1>
          <p
            className="text-sm text-muted-foreground"
          >
            Inicia sesión con tu correo electrónico y contraseña
          </p>
        </div>
        <LoginForm />

        <p
          className="absolute hidden sm:block bottom-4 left-4 text-xs text-neutral-400"
        >
          © {new Date().getFullYear()} Flyzzio - Todos los derechos reservados.
        </p>
        <Link
          href={'/legal/politicas-privacidad'}
          className="absolute bottom-4 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-4 text-xs text-neutral-400 hover:underline"
        >
          Políticas de Privacidad
        </Link>

      </div>
    </div>
  )
}

