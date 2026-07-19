import LoginForm from "@/features/auth/components/LoginForm"
import { GeneratePageTitle } from "@/shared/utils/metadata"
import { ArrowRight } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: GeneratePageTitle('Iniciar Sesión')
}

export default function Login() {

  return (
    <div className="min-h-screen relative">
      <div className="max-w-md mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="py-5">
            <Image
              src={'/img/logo/surtio-logo.svg'}
              alt="Surtio Logo"
              width={45}
              height={45}
            />
          </div>
          <h1 className="mb-1 text-lg font-semibold">Ingresa tus datos para comenzar</h1>
          <p className="text-muted-foreground text-center">
            ¿No tienes cuenta?{' '}
            <Link href={'/auth/register'} className="inline-flex items-center gap-0.5 group hover:underline text-primary font-medium">
              Registrate
              <span>
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-100" />
              </span>
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

