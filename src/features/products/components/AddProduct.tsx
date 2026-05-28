'use client'

import { Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button as CustomBtn } from "../../../components/animate-ui/components/buttons/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "../../../components/animate-ui/components/animate/tabs";
import ProductGeneral from "./create/ProductGeneral";
import ProductDetails from "./create/ProductDetails";
import ProductPrices from "./create/ProductPrices";
import ProductStock from "./create/ProductStock";
import { Button } from "../../../shared/components/ui/button";
import { useState } from "react";
import { ProductForm } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../../../components/ui/spinner";
import { sileo } from "sileo";
import { useBusinessStore } from "@/store/BusinessStore";
import { useUserStore } from "@/store/UserStore";


export default function AddProduct() {
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
    barcode: '',
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomBtn
          disabled={userRole === 'seller'}
          className={`${userRole === 'seller' && 'hidden'}`}
        >
          <Plus />
          Agregar
        </CustomBtn>
      </DialogTrigger>
      <DialogContent className="max-h-[70vh] overflow-y-scroll scrollbar-hide lg:overflow-y-hidden lg:min-w-200 px-2 lg:p-6">
        <DialogHeader>
          <DialogTitle>Añadir nuevo producto</DialogTitle>
          <DialogDescription>Completa los campos con la información del producto para crearlo</DialogDescription>
        </DialogHeader>

        <Tabs>
          <TabsList className="w-full mb-1 lg:mb-4">
            <TabsTrigger value={'general'}>General</TabsTrigger>
            <TabsTrigger value={'detalles'}>Detalles</TabsTrigger>
            <TabsTrigger value={'precios'}>Precios</TabsTrigger>
            <TabsTrigger value={'inventario'}>Inventario</TabsTrigger>
          </TabsList>
          <TabsContents>
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
          </TabsContents>
        </Tabs>
        <DialogFooter className="mt-1">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" variant={"outline"}>Cancelar</Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={handleCreate}
          >
            {loading ? (
              <>
                <Spinner />
                Guardando
              </>
            ) : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
