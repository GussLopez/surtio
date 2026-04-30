'use client'

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { updateProfile } from "@/lib/services/userService";
import { useUserStore } from "@/store/UserStore";
import { Profile, UserForm } from "@/types";
import { UploadSimpleIcon, UserIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

interface EditUserProps {
  children: React.ReactNode
  user: Profile;
}

export default function EditUserDrawer({ children, user }: EditUserProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({});
  const [isHover, setIsHover] = useState(false);
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        phone: user.phone
      })
    }
  }, [user, reset])
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserForm) => {
      const res = await fetch(`/api/users/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ profile: data })
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    onSuccess: () => {
      sileo.success({
        title: 'Perfil actualizado'
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      sileo.error({
        title: 'Error al actualziar el perfil',
        description: 'Ocurrió un error al actualizar la información, por favor contacta a soporte'
      });
      console.error(err);  
    }
  })

  const onSave = async (data: UserForm) => {
    mutate(data)
  }
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b border-input">
          <DrawerTitle>Edita tu información</DrawerTitle>
          <DrawerDescription>Modifica la información de tu perfil</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col grow">

          <div className="p-5">
            <motion.div
              onHoverStart={() => setIsHover(true)}
              onHoverEnd={() => setIsHover(false)}
              className="h-20 w-20 mx-auto flex justify-center items-center rounded-full border-4 border-input overflow-hidden ring-2 ring-input/40 bg-accent cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isHover ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UploadSimpleIcon size={40} weight="bold" className="text-neutral-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="user"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserIcon size={40} weight="bold" className="text-neutral-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="mt-5">
              <div className="">
                <Label htmlFor="name">Nombre</Label>
                <div className="mt-2">
                  <Input
                    id="name"
                    aria-invalid={errors.full_name?.message ? 'true' : 'false'}
                    {...register("full_name", {
                      required: 'El nombre es requerido'
                    })}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="lastName">Apellido</Label>
                <div className="mt-2">
                  <Input
                    id="lastName"
                    {...register("last_name")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="email">Email</Label>
                <div className="mt-2 cursor-not-allowed">
                  <Input
                    id="email"
                    value={user.email || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="mt-2">
                  <Input
                    id="phone"
                    {...register("phone")}
                  />
                </div>
              </div>
              {/* <div className="mt-5">
                  <Label htmlFor="description">Descripción</Label>
                  <div className="mt-2">
                    <Textarea
                      id="description"
                      className="min-h-20 max-h-40"
                      aria-invalid={errors.name?.message ? 'true' : 'false'}
                      {...register("description")}
                    />
                  </div>
                </div> */}
            </div>
          </div>

          <DrawerFooter className="mt-auto border-t border-input">
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Guardando
                </>
              ) : 'Guardar Cambios'}
            </Button>
            <DrawerClose asChild>
              <Button variant={'outline'}>Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer >
  )
}
