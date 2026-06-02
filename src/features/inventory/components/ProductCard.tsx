import { Package, MoreVertical, PencilIcon, SlidersHorizontal, Trash2Icon } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Separator } from "../../../shared/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../shared/components/ui/dropdown-menu";
import { Product } from "@/shared/types";
import Can from "@/shared/components/Can";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onAdjust: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const stockColor = product.stock <= product.min_stock
    ? "text-red-500 bg-red-50 dark:bg-red-950/30"
    : product.stock <= product.min_stock + 5 ? "text-amber-600 bg-amber-100 dark:bg-amber-950/30"
      : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
  return (
    <div className="rounded-lg border border-muted overflow-hidden">
      <div className="h-45 flex flex-col justify-center items-center bg-facent text-neutral-400 dark:text-neutral-600 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Can roles={["owner", "admin", "stock-man"]}>
              <Button
              variant={'ghost'}
              size={'icon'}
              className="rounded-full absolute right-3 top-3 text-neutral-400 z-50"
            >
              <MoreVertical />
              <span className="sr-only">Opciones del producto</span>
            </Button>
            </Can>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <PencilIcon />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SlidersHorizontal />
                Ajustar
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup onClick={() => onDelete(product)}>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {product?.image ? (
          <div
            className="w-full h-full flex items-center justify-center p-3 cursor-pointer"
            onClick={() => onView(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
            onClick={() => onView(product)}
          >
            <Package className="size-10 stroke-[1.5] text- opacity-60" />
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-base leading-tight text-foreground/90">{product.name}</h3>
            <Badge variant={'outline'} className="mt-1.5 font-mono text-[11px] text-primary-light font-semibold">
              {product.sku}
            </Badge>
          </div>
        </div>
        <div className="flex items-center py-2 px-3 bg-muted/30 rounded-lg border border-muted/50">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Costo</p>
            <p className="text-sm font-semibold text-foreground/80">${product.cost.toLocaleString()}</p>
          </div>
          <Separator orientation="vertical" className="h-7" />
          <div className="flex-1 text-end">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Venta</p>
            <p className="text-sm font-bold text-primary-light">${product.price.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t flex justify-between items-end">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Valor Total</p>
            <p className="font-black text-xl tracking-tight leading-none text-foreground">
              ${(product.price * product.stock).toLocaleString()}
              <span className="text-[10px] ml-1 text-muted-foreground font-normal">MXN</span>
            </p>
          </div>

          <div className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${stockColor}`}>
            {product.stock} <span className="text-[10px] font-medium opacity-80 uppercase">un.</span>
          </div>
        </div>

      </div>
    </div>
  )
}
