'use client';
import { User } from "@supabase/supabase-js"
import { Input } from "../ui/input"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { Button } from "../ui/button"
import Link from "next/link"
import { PackageIcon } from "@phosphor-icons/react"
import { Spinner } from "../ui/spinner"
import { Checkbox } from "../ui/checkbox"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ui/error-message"
import { useRouter } from "next/navigation"
import { sileo } from "sileo";

interface RegisterProps {
  user: User | null
}
interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register({ user }: RegisterProps) {
  const router = useRouter();
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
      if (error) {
        sileo.error({
          title: "Oopss...",
          description: "Ocurrio un error al registrarte"
        });
      }
      console.log('ERROR: ', error);
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
    <div className="col-span-8">
      <div className="max-w-104 mx-auto p-10">
        <div className="flex flex-col items-center mb-6">
          <PackageIcon size={60} className="text-primary mb-3" />
          <h1 className="mb-1 text-3xl font-semibold">Crea una cuenta</h1>
          <p className="text-sm text-gray-600 dark:text-neutral-200">¿Ya tienes cuenta? <Link className="text-primary underline font-medium" href={'/auth/login'}>Inicia sesión</Link></p>
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
          </div>
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
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
          <div className="flex gap-2 items-center mb-8">
            <Checkbox />
            <label
              htmlFor="remember"
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
        </form>
      </div>
    </div>
  )
}