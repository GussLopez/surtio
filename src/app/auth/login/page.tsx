'use client'

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { WarningCircleIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import ErrorMessage from "@/components/ui/error-message"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const initialValues: LoginForm = {
    email: "",
    password: "",
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  })
  const handleLogin = async (formData: LoginForm) => {
    setLoading(true);
    setAuthError(null);

    const { email, password } = formData;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setAuthError("Correo o contraseña incorrectos");
      } else {
        setAuthError("Ocurrió un error inesperado. Intenta nuevamente.");
      }
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();

    setLoading(false);
  }
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
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
          {authError && (
            <Alert variant={'destructive'}>
              <WarningCircleIcon size={20} />
              <AlertTitle className="font-semibold ">Credenciales Inválidas</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="email">Email</label>
            <Input
              id="email"
              type="text"
              aria-invalid={errors.email?.message ? 'true' : 'false'}
              {...register("email", {
                required: "El email es requerido"
              })}
            />
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="name">Password</label>
            <div className="relative">
              <Input
                id="name"
                aria-invalid={errors.password?.message ? "true" : "false"}
                type={isVisible ? 'text' : 'password'}
                {...register("password", {
                  required: 'La contraseña es requerida'
                })}
              />
              <Button
                variant='ghost'
                type="button"
                size='icon'
                onClick={() => setIsVisible(prevState => !prevState)}
                className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </div>
          <div className="flex justify-between mb-6">
            <div className="flex gap-2 items-center">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 dark:text-neutral-100"
              >Recuerdame</label>
            </div>
            <Link
              href={'/forgot-password'}
              className="text-sm text-primary-light dark:text-primary hover:underline font-medium"
            >¿Olvidaste tu contraseña?</Link>
          </div>
          <div>
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading && <Spinner className="size-4.5" />}
              Acceder
            </Button>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs overflow-hidden">
            <Separator className="w-full" />
            <span className="shrink-0 text-muted-foreground">O inicia sesión con</span>
            <Separator className="w-full" />
          </div>
          <Button
            variant={'outline'}
            className="w-full"
            type="button"
          >
            <div className="w-4 h-4">
              <img
                src="/img/icons/google.svg"
                alt="Google Icon"
              />
            </div>
            Google
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            ¿No tienes cuenta? <Link href={'/auth/register'} className="text-primary font-medium hover:underline">Registrate ahora.</Link>
          </p>
        </form>

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
    </div>
  )
}

