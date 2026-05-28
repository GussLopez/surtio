'use client';
import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/shared/components/ui/textarea";
import { useBusinessStore } from "@/store/BusinessStore";
import { useUserStore } from "@/store/UserStore";
import { Business, BusinessForm } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

interface EditBusinessProps {
  variant: 'legal' | 'contact' | 'name'
  business: Business;
  children: React.ReactNode
}
export default function EditBusinessDrawer({ business, variant, children }: EditBusinessProps) {
  const [open, setOpen] = useState(false);
  const setBusinessName = useBusinessStore(state => state.setName);
  const queryClient = useQueryClient();
  const userId = useUserStore(state => state.id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BusinessForm>({});

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        description: business.description || '',
        address: business.address || '',
        city: business.city || '',
        country: business.country || '',
        email: business.email || '',
        legal_name: business.legal_name || '',
        owner_id: business.owner_id,
        phone: business.phone || '',
        plan: business.plan,
        rfc: business.rfc || '',
        state: business.state || '',
        zip_code: business.zip_code || ''
      })
    }
  }, [business, reset])
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BusinessForm) => {
      const res = await fetch(`/api/businesses/${business.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          business: data
        })
      })
      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    onSuccess: (data) => {
      sileo.success({
        title: 'Tienda actualizada correctamente'
      });
      if (variant === "name") {
        setBusinessName(data.name);
      }
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["current-business", business.id]
      });

      queryClient.invalidateQueries({
        queryKey: ["business", userId]
      });
    },
    onError: (err) => {
      sileo.error({
        title: 'Error al guardar la información',
        description: 'Ocurrió un error al guardar los datos, por favor contacta a soporte'
      });
      console.error(err);
    }
  })
  const onSave = (data: BusinessForm) => {
    mutate(data)
  }
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b border-input">
          <DrawerTitle className="text-2xl">{business?.name}</DrawerTitle>
          <DrawerDescription>Edita la información de tu tienda</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col grow">
          {variant === "name" && (
            <div className="p-5">
              <div className="w-full h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted hover:text-gray-300 hover:bg-accent/40 cursor-pointer transition-all duration-300">
                <Image className="size-8" />
              </div>
              <div className="mt-5">
                <div className="">
                  <Label htmlFor="businessName">Nombre</Label>
                  <div className="mt-2">
                    <Input
                      id="businessName"
                      aria-invalid={errors.name?.message ? 'true' : 'false'}
                      {...register("name", {
                        required: 'El nombre es requerido'
                      })}
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <Label htmlFor="description">Descripción</Label>
                  <div className="mt-2">
                    <Textarea
                      id="description"
                      className="min-h-20 max-h-40"
                      aria-invalid={errors.name?.message ? 'true' : 'false'}
                      {...register("description")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {variant === "legal" && (
            <div className="p-5">
              <div className="">
                <Label htmlFor="legalName">Razón Social</Label>
                <div className="mt-2">
                  <Input
                    id="legalName"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("legal_name")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="rfc">RFC</Label>
                <div className="mt-2">
                  <Input
                    id="rfc"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("rfc")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="email">Email</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("email")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="mt-2">
                  <Input
                    id="phone"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("phone")}
                  />
                </div>
              </div>
            </div>
          )}
          {variant === "contact" && (
            <div className="p-5">
              <div className="">
                <Label htmlFor="country">País</Label>
                <div className="mt-2">
                  <Input
                    id="country"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("country")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="state">Estado</Label>
                <div className="mt-2">
                  <Input
                    id="state"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("state")}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="city">Ciudad</Label>
                <div className="mt-2">
                  <Input
                    id="city"
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    {...register("city")}
                  />
                </div>
              </div>
            </div>
          )}
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
    </Drawer>
  )
}
