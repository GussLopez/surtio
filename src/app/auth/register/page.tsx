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
    </div>
  )
}