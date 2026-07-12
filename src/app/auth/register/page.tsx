import Link from "next/link"
import Image from "next/image";
import { Metadata } from "next";
import { GeneratePageTitle } from "@/shared/utils/metadata";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: GeneratePageTitle('Registro')
}

export default function Register() {
  return (
    <div className="min-h-screen relative">
      <div className="max-w-118 mx-auto p-10">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-10">
            <Image
              src={'/img/logo/surtio-logo.svg'}
              alt="Surtio Logo"
              width={35}
              height={35}
            />
          </div>
          <h1 className="mb-1 text-lg font-semibold">Ingresa tus datos para comenzar</h1>
          <p className="text-muted-foreground text-center">
            ¿Ya tienes cuenta?{' '}
            <Link href={'/auth/login'} className="inline-flex items-center gap-0.5 group hover:underline text-primary font-medium">
              Inicia Sesión
              <span>
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-100"/>
              </span>
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
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
  )
}