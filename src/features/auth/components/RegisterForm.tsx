'use client'
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/shared/supabase/browser-client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { sileo } from "sileo";
import ErrorMessage from "@/shared/components/ui/error-message";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { SingUpInput } from "../types/auth.types"
import Link from "next/link"

export default function RegisterForm() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const initialValues: SingUpInput = {
    name: "",
    email: "",
    password: "",
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  })

  const handleRegister = async (formData: SingUpInput) => {
    if (!checked) {
      sileo.warning({
        title: 'Acepta los términos y condiciones para registrate'
      });
      return;
    }
    setLoading(true);
    const { email, password, name } = formData;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
        data: {
          name,
          email,
          role: 'owner',
          create_business: true
        }
      }
    })

    if (error) {
      sileo.error({
        title: "Error al registrarte",
        description: "Ocurrió un error al crear la cuenta, por favor intenta más tarde"
      });
      console.error(error);
      return;
    }
    sileo.success({
      title: "Cuenta creada",
      description: "Inicia sesión con tus credenciales"
    });
    setLoading(false);
    router.push('/admin');
  }
  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-3">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="nombre">Nombres</label>
        <Input
          id="nombre"
          type="text"
          aria-invalid={errors.name?.message ? 'true' : 'false'}
          {...register("name", {
            required: "El nombre es requerido",
          })}
        />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>
      </div>
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
          htmlFor="name">Contraseña</label>
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
      <div className="flex gap-2 items-center mb-4">
        <Checkbox
          id="termsAndConditions"
          onCheckedChange={e => setChecked(e ? true : false)}
        />
        <label
          htmlFor="termsAndConditions"
          className="text-sm text-gray-600 dark:text-neutral-100"
        >
          Acepto <Link href={'/'} className="hover:underline">términos y condiciones</Link>
        </label>
      </div>
      <div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading && <Spinner className="size-4.5" />}
          Registrarse
        </Button>
      </div>
      <div className="flex justify-center items-center gap-4 text-xs overflow-hidden">
        <Separator className="w-full" />
        <span className="shrink-0 text-muted-foreground">O registrate con</span>
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
        ¿Ya tienes cuenta? <Link href={'/auth/login'} className="text-primary font-medium hover:underline">Inicia sesión.</Link>
      </p>
    </form>
  )
}
