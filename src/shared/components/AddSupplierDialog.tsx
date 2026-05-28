'use client';
import { PlusIcon } from "@phosphor-icons/react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Supplier, SupplierForm } from "@/types";
import { useBusinessStore } from "@/store/BusinessStore";
import { sileo } from "sileo";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

interface AddSuplierProps {
  open: boolean;
  onClose: () => void;
  onCraeted?: (supplier: Supplier) => void;
}

export default function AddSupplierDialog({ open, onClose, onCraeted }: AddSuplierProps) {
  const [collapOpen, setCollapOpen] = useState(false);
  const businessId = useBusinessStore(state => state.id);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SupplierForm>({
    defaultValues: {
      name: '',
      contact_name: null,
      email: null,
      address: null,
      is_active: true,
      phone: null,
      notes: null,
      business_id: businessId || '',
    }
  })


  useEffect(() => {
    if (businessId) {
      setValue("business_id", businessId);
    }
  }, [businessId, setValue]);

  const handleCreateSupplier = async (formData: SupplierForm) => {
    if (!businessId) {
      sileo.error({
        title: "No hay tienda seleccioanda",
        description: 'Selecciona una tienda para poder crear un proveedor'
      })
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/suppliers/create', {
        method: 'POST',
        body: JSON.stringify({ supplier: formData })
      })
      if (!res.ok) throw new Error('Error fetching');

      sileo.success({
        title: 'Proveedor creado',
        description: 'El proveedor se creó correctamente',
        autopilot: false
      });

      queryClient.invalidateQueries({ queryKey: ["business-suppliers"] });

      onCraeted?.(await res.json());

      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(error);
      sileo.error({
        title: 'Error al crear proveedor',
        description: 'Ocurrio un error, por favor intenta más tarde'
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent aria-describedby="Crear un nuevo proveedor">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusIcon size={20} weight="bold" />
            Añadir nuevo proveedor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateSupplier)} className="space-y-4 mt-5">
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
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner />
                  Guardando
                </>
              ) : 'Guardar Proveedor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
