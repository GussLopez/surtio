'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import ProductGeneral from "./create/ProductGeneral";
import ProductDetails from "./create/ProductDetails";
import ProductPrices from "./create/ProductPrices";
import ProductStock from "./create/ProductStock";
import { Button } from "@/shared/components/ui/button";
import { useEffect, useState } from "react";
import { Product } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { Spinner } from "@/shared/components/ui/spinner";
import { ProductForm } from "../types/products.types";

interface EditModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}


export default function EditProductModal({ open, onClose, product }: EditModalProps) {
  const productId = product?.id
  const queryClient = useQueryClient();
  const [loading, setLoadig] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 0,
    sku: '',
    model: '',
    image: null,
    barcode: '',
    location: '',
    is_active: true,
    unit: '',
    supplier_id: null,
    category_id: null
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price || 0,
        cost: product.cost || 0,
        stock: product.stock || 0,
        min_stock: product.min_stock || 0,
        sku: product.sku,
        model: product.model,
        image: null,
        location: product.location,
        barcode: product.barcode,
        is_active: product.is_active,
        unit: product.unit,
        supplier_id: product.supplier_id,
        category_id: product.category_id
      });
    }
  }, [product]);
  const updateForm = (data: Partial<ProductForm>) =>
    setFormData(prev => ({ ...prev, ...data }))

  const mutation = useMutation({
    mutationFn: async () => {
      setLoadig(true);
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: formData,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al editar el producto");
      }
    },
    onSuccess: () => {
      setLoadig(false);
      queryClient.invalidateQueries({ queryKey: ["stock-products"] })
      sileo.success({
        title: 'Cambios guardados',
        description: 'Cambios guardados correctamente',
        autopilot: false,
      })
      onClose();
    },
    onError: (error) => {
      setLoadig(false);
      sileo.error({
        title: "Acceso denegado",
        description: error.message || "No tienes permisos para realizar esta acción",
      });
      console.error(error)
    },
  })

  const handleEdit = () => {
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[70vh] overflow-y-scroll scrollbar-hide lg:overflow-y-hidden lg:min-w-200 px-2 lg:p-6">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Completa los campos con la información del producto para editarlo</DialogDescription>
        </DialogHeader>

        <Tabs>
          <TabsList className="w-full mb-1 lg:mb-4">
            <TabsTrigger value={'general'}>General</TabsTrigger>
            <TabsTrigger value={'detalles'}>Detalles</TabsTrigger>
            <TabsTrigger value={'precios'}>Precios</TabsTrigger>
            <TabsTrigger value={'inventario'}>Inventario</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ProductGeneral formData={formData} onChange={updateForm} />
          </TabsContent>
          <TabsContent value="detalles">
            <ProductDetails formData={formData} onChange={updateForm} />
          </TabsContent>
          <TabsContent value="precios">
            <ProductPrices formData={formData} onChange={updateForm} />
          </TabsContent>
          <TabsContent value="inventario">
            <ProductStock formData={formData} onChange={updateForm} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-1">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" variant={"outline"}>Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleEdit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Guardando
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
