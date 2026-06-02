import { Button } from "@/shared/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import { Product } from "@/shared/types";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface AdjustStockProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function AdjustStock({ product, open, onClose }: AdjustStockProps) {
  const [newStock, setNewStock] = useState(product.stock);

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
            >
              <Minus />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-7xl font-bold tracking-tight">{newStock}</span>
            </div>
            <Button
              size={'icon'}
              variant={'outline'}
              className="rounded-full"
            >
              <Plus />
            </Button>
          </div>
          <DrawerFooter>
            <Button>
              Guardar Stock
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
