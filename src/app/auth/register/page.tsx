import Link from "next/link"
import Image from "next/image";
import { Metadata } from "next";
import { GeneratePageTitle } from "@/shared/utils/metadata";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: GeneratePageTitle('Registro')
}

export default function Register() {
  return (
    <div className="min-h-screen relative">
      <div className="max-w-104 mx-auto p-10">
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
          <h1 className="mb-1 text-3xl font-semibold">Crea una cuenta</h1>
          <p
            className="text-sm text-muted-foreground text-center"
          >Únete ahora para optimizar tu experiencia desde el primer día.</p>
        </div>
        <RegisterForm />
      </div>
      <p
        className="absolute bottom-4 left-4 text-xs text-neutral-400"
      >
        © {new Date().getFullYear()} Flyzzio - Todos los derechos reservados.
      </p>
      <Link
        href={'/legal/politicas-privacidad'}
        className="absolute bottom-4 right-4 text-xs text-neutral-400 hover:underline"
      >
        Políticas de Privacidad
      </Link>
    </div>
  )
}