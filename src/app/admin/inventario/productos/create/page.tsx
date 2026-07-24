'use client';

import { ProductForm } from "@/features/inventory/types/products.types";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { useUserStore } from "@/shared/store/UserStore";
import { cn } from "@/shared/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleQuestionMark, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
    is_active: true,
    supplier_id: null,
    category_id: null
  }
  const [formData, setFormData] = useState(initialFormData);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const userRole = useUserStore(state => state.role);
  const [open, setOpen] = useState(false);
  const updateForm = (data: Partial<ProductForm>) =>
    setFormData(prev => ({ ...prev, ...data }))

  const handleCreate = async () => {
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

      setFormData(initialFormData);
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
    <div className="w-full max-w-4xl mx-auto">
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
              <Input id="productName" />
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium">Tipo</span>
              <div className="grid grid-cols-2 lg:flex gap-2 text-sm text-foreground/80">
                <Button
                  variant={'outline'}
                  className={cn(formData.type === 'product' && 'border-primary-light',
                    "shadow-none border-[1.8px]"
                  )}
                >
                  Producto
                </Button>
                <Button
                  variant={'outline'}
                  className={cn(formData.type === 'service' && 'border-primary-light',
                    "shadow-none border-[1.8px]"
                  )}
                >
                  Servicio
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Código de barras</Label>
              <Input id="barcode" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" />
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

      <div className="mt-6 border border-input rounded-lg shadow-xs bg-background">
        <h2 className="font-medium p-6">Datos adicionales</h2>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <Label>Unidad de venta</Label>

          </div>
        </div>
      </div>
    </div>
  )
}
