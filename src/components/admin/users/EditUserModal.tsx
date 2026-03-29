import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { updateProfile } from "@/lib/services/userService";
import { useBusinessStore } from "@/store/BusinessStore";
import { UserIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";

interface EditUserProps {
  employe: {
    id: string
    name: string;
    email: string;
    role: string;
  }
  onClose: () => void;
  open: boolean
}
export default function EditUserModal({ employe, onClose, open }: EditUserProps) {
  console.log(employe);
  const businessId = useBusinessStore(state => state.id);
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const { register, handleSubmit, getValues, control, formState: { errors } } = useForm({
    defaultValues: {
      name: employe.name,
      email: employe.email,
      role: employe.role
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: { name: string; role: string }) => {
      await updateProfile(employe.id, {
        full_name: formData.name,
        role: formData.role
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-users"] })
      sileo.success({
        title: 'Cambios guardados',
        description: 'Usuario actualizado correctamente',
        autopilot: false,
      })
      onClose();
    },
    onError: () => {
      sileo.error({
        title: 'Algo salió mal',
        description: 'Por favor intente más tarde'
      })
    }
  })
 
  const onSave = (data: any) => {
    mutate(data)
  }
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>
        <form>
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
            <Field className="gap-1 cursor-not-allowed">
              <FieldLabel htmlFor="email" className="gap-0">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                disabled
                aria-invalid={errors.email?.message ? 'true' : 'false'}
                {...register('email', {
                  required: "El email es requerido"
                })}
              />
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
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
                  <Select 
                  onValueChange={field.onChange}
                   value={field.value}
                   disabled={employe.role === "owner"}
                   >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {employe.role === "owner" && (
                        <SelectItem value="owner">Propietario</SelectItem>
                      )}
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
              <Button variant={'secondary'}>Cancelar</Button>
            </DialogClose>
            <Button
              disabled={isPending || !businessId}
              type="submit"
              onClick={handleSubmit(onSave)}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Guardando
                </>
              ) : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
