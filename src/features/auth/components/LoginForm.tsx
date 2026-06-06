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
  )
}
