import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Control, Controller, UseFormRegister, UseFormSetValue, useWatch } from "react-hook-form";
import { ProductForm } from "../../types/products.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Categorie } from "@/shared/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddCategorieDialog from "@/shared/components/AddCategorieDialog";
import { Button } from "@/shared/components/ui/button";

interface AditionalDataProps {
  register: UseFormRegister<ProductForm>;
  control: Control<ProductForm>;
  setValue: UseFormSetValue<ProductForm>;
}

export default function AditionalData({ register, control, setValue }: AditionalDataProps) {
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useQuery<Categorie[]>({
    queryKey: ["business-categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories', {
        method: 'GET'
      })

      if (!res.ok) throw new Error('Error fetching categories');

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true
  })

  return (
    <div className="mt-6 border border-input rounded-lg shadow-xs bg-background">
      <h2 className="font-medium p-6">Datos adicionales</h2>

      <div className="grid grid-cols-3 gap-5 p-6 pt-0">
        <div className="space-y-2">
          <Label htmlFor="unit">Unidad de venta</Label>
          <Input
            id="unint"
            {...register("unit")}
          />
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <div className="flex items-center gap-1">
            <Controller
              control={control}
              name="category_id"

              render={({ field }) => {
                return (
                  <Select
                    value={field.value === null ? "ninguno" : String(field.value)}
                    onValueChange={(value) => {
                      field.onChange(value === "ninguno" ? null : Number(value));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="ninguno">Ninguno</SelectItem>
                      {isLoading && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                      {data?.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id.toString()}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }}
            />
            <Button
              variant={'outline'}
              size={'icon'}
              onClick={() => setOpenModal(true)}
              type="button"
            >
              <Plus />
              <span className="sr-only">Crear categoría</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Marca</Label>
          <Input />
        </div>
        <div className="space-y-2">
          <Label>Ubicación</Label>
          <Input placeholder="Ej: Estante 3B" />
        </div>
        <div className="space-y-2 col-span-3">
          <Label>Descripción</Label>
          <Textarea
            className="max-h-30"
            {...register("description")}
          />
        </div>
      </div>

      <AddCategorieDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        onCraeted={(categorie) => {
          // La categoría recién creada ya está en la caché de react-query,
          // así que podemos seleccionarla directamente en el select.
          setValue("category_id", Number(categorie.id), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
          setOpenModal(false);
        }}
      />
    </div>
  )
}
