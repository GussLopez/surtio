'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { getSupabaseBrowserClient } from "@/shared/supabase/browser-client"
import { useRouter } from "next/navigation"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Input } from "@/shared/components/ui/input"
import ErrorMessage from "@/shared/components/ui/error-message"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Spinner } from "@/shared/components/ui/spinner"
import { Separator } from "@/shared/components/ui/separator"
import { SignInInput } from "../types/auth.types"
import Link from "next/link"

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const initialValues: SignInInput = {
    email: "",
    password: "",
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  })
  const handleLogin = async (formData: SignInInput) => {
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
    setLoading(false);

    router.push('/admin');
  }
  return (
    <div>
      <div className="flex flex-col gap-4">
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
          Continua con Google
        </Button>
        <div className="flex justify-center items-center gap-4 my-4 text-xs overflow-hidden">
          <Separator className="w-full" />
          <span className="shrink-0 text-muted-foreground">O</span>
          <Separator className="w-full" />
        </div>
      </div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col space-y-6">
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
            <div className="flex items-center justify-between">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="name">Contraseña
              </label>
              <Link
                className="text-sm font-medium text-primary hover:underline"
                href={'/auth/forgor-password'}
              >¿Olvidaste tu contraseña?</Link>
            </div>
            <Input
              id="name"
              type="password"
              aria-invalid={errors.password?.message ? 'true' : 'false'}
              {...register("password", {
                required: "La contraseña es requerida"
              })}
            />
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading && <Spinner className="size-4.5" />}
              Ingresar
            </Button>
          </div>
        </div>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Al iniciar sesión, aceptas los{' '}
        <Link
          href={'/'}
          className="underline hover:text-foreground transition-colors"
        >Términos y Condiciones</Link> y las{' '}
        <Link
          href={'/'}
          className="underline hover:text-foreground transition-colors"
        >Política de privacidad</Link>.
      </p>
    </div>
  )
}
