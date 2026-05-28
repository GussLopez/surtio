'use client';;
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ClipboardCheck, ClipboardX } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { useForm } from "react-hook-form";
import { Supplier, SupplierForm } from "@/types";
import { sileo } from "sileo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../../../components/ui/spinner";
import { Switch } from "@/components/ui/switch";

interface AddSuplierProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier
}

export default function EditSupplierDialog({ open, onClose, supplier }: AddSuplierProps) {
  const [collapOpen, setCollapOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SupplierForm>()
  const isActive = watch("is_active");

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contact_name: supplier.contact_name || null,
        email: supplier.email || null,
        address: supplier.address || null,
        is_active: supplier.is_active ?? true,
        phone: supplier.phone || null,
        notes: supplier.notes || null,
      });
    }
  }, [supplier, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: SupplierForm) => {
      const res = await fetch(`/api/suppliers/${supplier.id}`, {
        method: 'PUT',
        body: JSON.stringify({ supplier: formData })
      });

      if (!res.ok) throw new Error("Error fetching");
      return res.json();
    },
    onSuccess: () => {
      sileo.success({
        title: 'Cambios guardados',
        description: 'Los datos del proveedor se actualizaron correctamente',
        autopilot: false
      });
      queryClient.invalidateQueries({ queryKey: ["business-suppliers"] });
      onClose();
    },
    onError: () => {
      sileo.error({
        title: 'Error al editar el proveedor',
        description: 'Ocurrio un error, por favor intenta más tarde'
      })
    }
  })

  const onSave = (supplier: SupplierForm) => {
    mutate(supplier)
  }
  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent aria-describedby="Crear un nuevo proveedor">
        <DialogHeader>
          <DialogTitle>
            Editar proveedor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 mt-5">
          <div>
            <Label
              htmlFor="supplierName"
              className="mb-2.5"
            >Nombre / Empresa<span className="text-red-500">*</span></Label>
            <Input
              id="supplierName"
              type="text"
              placeholder="Ej. Distribuidora central"
              aria-invalid={errors.name?.message ? 'true' : 'false'}
              {...register('name', {
                required: 'El nombre es requerido'
              })}
            />
          </div>
          <div>
            <Label
              htmlFor="contactName"
              className="mb-2.5"
            >Nombre de contacto</Label>
            <Input
              id="contactName"
              type="text"
              placeholder="Ej. Juan Pérez"
              {...register("contact_name")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="supplierPhone"
                className="mb-2.5"
              >Teléfono</Label>
              <Input
                id="supplierPhone"
                type="phone"
                placeholder="+52 998"
                {...register("phone")}
              />
            </div>
            <div>
              <Label
                htmlFor="supplierEmail"
                className="mb-2.5"
              >Email</Label>
              <Input
                id="supplierEmail"
                type="text"
                placeholder="Ej. proveedor@gmail.com"
                {...register("email")}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="isActive"
              className="py-3 mt-6 flex justify-between items-center px-3 rounded-md border border-input has-data-[state=checked]:border-primary/50 relative transition duration-300"
            >
              <span className="flex items-center gap-2 text-xs font-medium">
                {isActive ? <ClipboardCheck size={20} /> : <ClipboardX size={20} />}
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={value => setValue("is_active", value)}
              />

            </label>
          </div>
          <div className="px-2 rounded-md bg-facent">
            <Collapsible open={collapOpen} onOpenChange={setCollapOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex justify-between items-center p-2 font-medium text-muted-foreground text-sm">
                  Más opciones
                  <motion.div
                    animate={{ rotate: collapOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </CollapsibleTrigger>
              <AnimatePresence initial={false}>
                {collapOpen && (
                  <CollapsibleContent forceMount asChild>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden space-y-3"
                    >

                      <div className="px-2 pt-2">
                        <Label
                          htmlFor="supplierAddress"
                          className="mb-2.5"
                        >Dirección</Label>
                        <Input
                          id="supplierAddress"
                          type="text"
                          placeholder="Ej. Av Colosio 77500 Cancún"
                          className="bg-white"
                          {...register("address")}
                        />
                      </div>
                      <div className="px-2 pb-4">
                        <Label
                          htmlFor="supplierNotes"
                          className="mb-2.5"
                        >Notas</Label>
                        <Textarea
                          id="supplierNotes"
                          placeholder="Ej. Horarios, condiciones de pago, detalles del servicio"
                          className="max-h-30 bg-white"
                          {...register("notes")}
                        />
                      </div>
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancelar</Button>
            </DialogClose>
            <Button
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <Spinner />
                  Guardando
                </>
              ) : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
