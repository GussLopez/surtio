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
      <div className="max-w-md mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-10">
            <Image
              src={'/img/logo/surtio-logo.svg'}
              alt="Surtio Logo"
              width={35}
              height={35}
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

      </div>
    </div>
  )
}

