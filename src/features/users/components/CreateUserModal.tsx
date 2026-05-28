'use client'
import { createEmploye } from "@/features/users/lib/action";
import { Button as AnimatedBtn } from "@/shared/components/animate-ui/components/buttons/button";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import ErrorMessage from "@/shared/components/ui/error-message";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Spinner } from "@/shared/components/ui/spinner";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { Employe } from "@/shared/types";
import { UserIcon, UserPlusIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";

export default function CreateUser() {
  const businessId = useBusinessStore(state => state.id);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<Employe>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      business_id: businessId || '',
    }
  })

  useEffect(() => {
    if (businessId) {
      setValue("business_id", businessId);
    }
  }, [businessId, setValue]);
  const handleCreateEmploye = async (formData: Employe) => {
    if (!businessId) {
      sileo.error({
        title: "Error",
        description: "No se ha seleccionado una tienda activa."
      });
      return;
    }
    try {
      setLoading(true);
      const { success } = await createEmploye(formData)

      if (success) {
        sileo.success({
          title: 'Empleado creado',
          description: 'Comparte las credenciales para que pueda acceder'
        })
        queryClient.invalidateQueries({ queryKey: ["business-users"] });
        setOpen(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimatedBtn>
          <UserPlusIcon size={20} weight="bold" />
          Crear usuario
        </AnimatedBtn>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateEmploye)}>
          <div className="h-20 w-20 mx-auto flex justify-center items-center rounded-full border-4 border-input overflow-hidden ring-2 ring-input/40 bg-accent">
            <UserIcon size={40} weight="bold" className="text-muted-foreground" />
          </div>
          <FieldSet className="gap-2">
            <Field className="gap-1">
              <FieldLabel htmlFor="name">
                Nombre completo
              </FieldLabel>
              <Input
                id="name"
                type="text"
                aria-invalid={errors.name?.message ? 'true' : 'false'}
                {...register("name", {
                  required: "El nombre es requerido"
                })}
              />
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
            </Field>
            <Field className="gap-1">
              <FieldLabel htmlFor="email" className="gap-0">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                aria-invalid={errors.email?.message ? 'true' : 'false'}
                {...register('email', {
                  required: "El email es requerido"
                })}
              />
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
            </Field>
            <Field className="gap-1">
              <FieldLabel htmlFor="password">
                Contraseña <span className="font-light text-xs text-muted-foreground">(Mín. 6 car.)</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={isVisible ? 'text' : 'password'}
                  aria-invalid={errors.password?.message ? 'true' : 'false'}
                  {...register("password", {
                    required: "La contraseña es requerida"
                  })}
                />
                <Button
                  variant='ghost'
                  type="button"
                  size='icon'
                  onClick={() => setIsVisible(prevState => !prevState)}
                  className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
                >
                  {isVisible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
              <ErrorMessage>{errors.password?.message}</ErrorMessage>
            </Field>
            <Field className="gap-1">
              <FieldLabel htmlFor="role">
                Rol
              </FieldLabel>
              <Controller
                name="role"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="seller">Vendedor</SelectItem>
                      <SelectItem value="stock-man">Gestor de inventario</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldSet>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant={'outline'}>Cancelar</Button>
            </DialogClose>
            <Button
              disabled={loading || !businessId}
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner />
                  Creando
                </>
              ) : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
