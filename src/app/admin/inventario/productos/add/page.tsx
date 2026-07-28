'use client';

import AditionalData from "@/features/inventory/components/create/AditionalData";
import { ProductForm } from "@/features/inventory/types/products.types";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import ErrorMessage from "@/shared/components/ui/error-message";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { useUserStore } from "@/shared/store/UserStore";
import { cn } from "@/shared/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleQuestionMark, DollarSign, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";

export default function CreateProductPage() {
  const businessId = useBusinessStore(state => state.id);
  const initialFormData: ProductForm = {
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 0,
    sku: '',
    model: '',
    image: null,
    location: '',
    barcode: '',
    type: 'product',
    unit: '',
    use_stock: true,
    is_active: true,
    supplier_id: null,
    category_id: null
  }
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const userRole = useUserStore(state => state.role);
  const [open, setOpen] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<ProductForm>({
    defaultValues: initialFormData,
  });

  const type = watch("type");
  const useStock = watch("use_stock");

  const handleCreate = async (formData: ProductForm) => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: formData,
          businessId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear producto");
      }

      queryClient.invalidateQueries({ queryKey: ["stock-products", businessId] });
      setLoading(false);
      setOpen(false);
      sileo.success({
        title: 'Producto guardado',
        description: 'El producto se creó y se guardó correctamente'
      })
    } catch (error) {
      setLoading(false);
      sileo.error({
        title: "Algo salió mal",
        description: "Por favor intente más tarde.",
      });
      console.log('Error: ', error);
    }

  }
  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <form onSubmit={handleSubmit(handleCreate)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Button
              variant={'outline'}
              size={'icon'}
            >
              <Link href={'/admin/inventario'}>
                <ArrowLeft className="size-5" />
                <span className="sr-only">Volver atras</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Agregar producto</h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="border border-input rounded-lg shadow-xs bg-background">
            <h2 className="font-medium p-6">Datos del producto</h2>

            <div className="grid grid-cols-2 gap-5 px-6 pb-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="productName">Nombre del producto *</Label>
                <Input
                  id="productName"
                  {...register("name", {
                    required: "El nombre es requerido"
                  })}
                />
                <ErrorMessage>{errors.name?.message}</ErrorMessage>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium">Tipo</span>
                <div className="grid grid-cols-2 lg:flex gap-2 text-sm text-foreground/80">
                  <Button
                    variant={'outline'}
                    type="button"
                    onClick={() => setValue("type", "product")}
                    className={cn(type === 'product' && 'border-primary-light',
                      "shadow-none border-[1.8px]"
                    )}
                  >
                    Producto
                  </Button>
                  <Button
                    variant={'outline'}
                    onClick={() => setValue("type", "service")}
                    type="button"
                    className={cn(type === 'service' && 'border-primary-light',
                      "shadow-none border-[1.8px]"
                    )}
                  >
                    Servicio
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de barras</Label>
                <Input
                  id="barcode"
                  {...register("barcode")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                />
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Checkbox id="isActive" />
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="isActive"
                    className="text-sm"
                  >
                    Vender en el Punto de Venta
                  </label>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="size-5 text-background fill-neutral-400 dark:fill-white" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="max-w-40 text-center">
                        Al desactivar esta opción, no podrás vender el producto en el punto de venta, pero podras verlo en inventario y modificarlo.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-input rounded-lg shadow-xs bg-background">
            <h2 className="font-medium p-6">Imagen</h2>
            <div className="flex-1 gap-2 px-6 pb-6">
              <div className="w-full h-full flex flex-col justify-center items-center gap-2 border border-dashed border-input rounded-lg hover:bg-muted/50 cursor-pointer text-primary-light">
                <div className="flex justify-center items-center p-2 rounded-xl bg-primary/10">
                  <ImageIcon className="size-8" />
                </div>
                <span className="text-xs font-medium text-center">Añadir Imagen</span>
              </div>
            </div>
          </div>
        </div>

        <AditionalData
          register={register}
          control={control}
          setValue={setValue}
        />

        <div className="mt-6 border border-input rounded-lg shadow-xs bg-background">
          <h2 className="font-medium p-6">Existencias</h2>

          <div className="grid grid-cols-3 gap-5 p-6 pt-0">
            <Controller
              name="use_stock"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3 col-span-3 mb-2">
                  <Checkbox
                    id="use_stock"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="flex items-center gap-3">
                    <Label htmlFor="use_stock">Utilizar Existencias</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleQuestionMark className="size-5 text-background fill-neutral-400 dark:fill-white" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="max-w-40 text-center">
                          Los productos que no utilizan existencias siempre están en stock.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="stock">Cantidad</Label>
              <div className="relative">
                <Input
                  id="stock"
                  disabled={!useStock}
                  {...register("stock", {
                    required: "El stock es requerido"
                  })}
                />
                <span className={cn(!useStock ? 'hidden' : 'flex', "absolute h-full justify-center items-center px-2 right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground")}
                >Unidades</span>
              </div>
              <ErrorMessage>{errors.stock?.message}</ErrorMessage>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Cantidad mínima</Label>
              <div className="relative">
                <Input
                  disabled={!useStock}
                  id="min_stock"
                  {...register("min_stock")}
                />
                <span
                  className={cn(!useStock ? 'hidden' : 'flex', "absolute h-full justify-center items-center px-2 right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground")}
                >Unidad</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 border border-input rounded-lg shadow-xs bg-background">
          <h2 className="font-medium p-6">Precios y costos</h2>

          <div className="grid grid-cols-3 gap-5 p-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="price">Precio de venta</Label>
              <div className="relative">
                <DollarSign className="absolute h-full flex justify-center items-center left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="price"
                  placeholder="0.0"
                  className="pl-8"
                  {...register("price", {
                    required: "El precio de venta es requerido"
                  })}
                />
              </div>
              <ErrorMessage>{errors.price?.message}</ErrorMessage>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <div className="relative">
                <DollarSign className="absolute h-full flex justify-center items-center left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="0.0"
                  className="pl-8"
                  {...register("cost")}
                />
                <span className="absolute h-full flex justify-center items-center px-2 right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">por Unidad</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-64 right-0 border-t border-input bg-background">
          <div className="max-w-4xl flex justify-end gap-3 px-4 mx-auto py-3">
            <Button
              variant={'outline'}
              asChild
              type="button"
            >
              <Link href={'/admin/inventario'}>
                Cancelar
              </Link>
            </Button>
            <Button
              type="submit"
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
