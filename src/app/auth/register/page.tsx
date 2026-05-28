'use client';

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { sileo } from "sileo";
import Image from "next/image";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const initialValues: RegisterForm = {
    name: "",
    email: "",
    password: "",
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  })

  const handleRegister = async (formData: RegisterForm) => {
    if (!checked) {
      sileo.warning({
        title: 'Acepta los términos y condiciones para registrate'
      });
      return;
    }
    try {
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
      setLoading(false);
      router.push('/admin');
      if (error) {
        sileo.error({
          title: "Oopss...",
          description: "Ocurrio un error al registrarte"
        });
      }
      if (!error) {
        sileo.success({
          title: "Cuenta creada",
          description: "Inicia sesión con tus credenciales"
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar un usuario');
    }
  }
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