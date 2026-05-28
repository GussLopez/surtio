'use client';
import { PlusIcon } from "@phosphor-icons/react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Categorie, CategorieForm } from "@/types";
import { useBusinessStore } from "@/store/BusinessStore";
import { sileo } from "sileo";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/shared/components/ui/spinner";

interface AddSuplierProps {
  open: boolean;
  onClose: () => void;
  onCraeted?: (categorie: Categorie) => void;
}

export default function AddCategorieDialog({ open, onClose, onCraeted }: AddSuplierProps) {
  const businessId = useBusinessStore(state => state.id);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategorieForm>({
    defaultValues: {
      name: '',
      description: '',
      business_id: businessId || '',
    }
  })


  useEffect(() => {
    if (businessId) {
      setValue("business_id", businessId);
    }
  }, [businessId, setValue]);

  const handleCreateCategorie = async (formData: CategorieForm) => {
    if (!businessId) {
      sileo.error({
        title: "No hay tienda seleccioanda",
        description: 'Selecciona una tienda para poder crear un categoría'
      })
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ categorie: formData })
      })

      if (!res.ok) throw new Error('Error creating categorie');
      const newCategorie = await res.json();
      sileo.success({
        title: 'Categoría creado',
        description: 'La categoría se creó correctamente',
        autopilot: false
      });

      queryClient.invalidateQueries({ queryKey: ["business-categories"] });

      onCraeted?.(newCategorie);

      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(error);
      sileo.error({
        title: 'Error al crear la categoría',
        description: 'Ocurrio un error, por favor intenta más tarde'
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent aria-describedby="Crear una nueva categoria">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusIcon size={20} weight="bold" />
            Añadir nuevo categoría
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateCategorie)} className="space-y-4 mt-5">
          <div>
            <Label
              htmlFor="categorieName"
              className="mb-2.5"
            >Nombre<span className="text-red-500">*</span></Label>
            <Input
              id="categorieName"
              type="text"
              placeholder="Ej. Celulares"
              aria-invalid={errors.name?.message ? 'true' : 'false'}
              {...register('name', {
                required: 'El nombre es requerido'
              })}
            />
          </div>
          <div>
            <Label htmlFor="categorieDescription" className="mb-2.5">Descripción</Label>
            <Textarea
              id="categorieDescription"
              className="max-h-35"
              {...register("description")}
            />
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
              ) : 'Guardar Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
