import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import { Spinner } from "@/shared/components/ui/spinner";
import { Product } from "@/shared/types";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { sileo } from "sileo";

interface AdjustStockProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function AdjustStock({ product, open, onClose }: AdjustStockProps) {
  const [newStock, setNewStock] = useState(product.stock);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) throw new Error('Error al modificar el stock');

      return res.json();
    },
    onSuccess: () => {
      sileo.success({
        title: 'Stock guardado',
        description: 'El stock del producto se guardó correctamente',
        autopilot: false
      });
      onClose();
    },
    onError: () => {
      sileo.error({
        title: 'Error al guardar el stock',
        description: 'Ocurrió un error al modificar el stock del producto, por favor intenta más tarde'
      })
    }
  })
  return (
    <Drawer open={open} onClose={() => onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Ajustar Stock</DrawerTitle>
            <DrawerDescription>
              Ajusta el stock del producto, este movimiento no guarda un registro
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex items-center justify-center gap-2">
            <Button
              size={'icon'}
              variant={'outline'}
              className="rounded-full"
              onClick={() => setNewStock(prev => prev - 1)}
              disabled={newStock < 1}
            >
              <Minus />
            </Button>
            <div className="flex-1 flex flex-col text-center">
              <span className="text-7xl font-bold tracking-tight">{newStock}</span>
              <span className="text-sm text-muted-foreground">
                Agregado: {newStock - product.stock}
              </span>
            </div>
            <Button
              size={'icon'}
              variant={'outline'}
              className="rounded-full"
              onClick={() => setNewStock(prev => prev + 1)}
            >
              <Plus />
            </Button>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                  Guardando
                </>
              ) : 'Guardar Stock'}
            </Button>
            <DrawerClose asChild>
              <Button variant={'outline'}>
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
