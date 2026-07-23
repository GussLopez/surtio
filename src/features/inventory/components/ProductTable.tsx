'use client'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Image, MoreHorizontal, PencilIcon, SlidersHorizontal, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Product } from "@/shared/types";
import Can from "@/shared/components/Can";

interface ProductTableProps {
  data: Product[]
  isLoading?: boolean;
  totalInventario: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onAdjust: (product: Product) => void;
}

export default function ProductTable({
  data,
  isLoading,
  totalInventario,
  onEdit,
  onDelete,
  onView,
  onAdjust
}: ProductTableProps) {
  return (
    <div className="rounded-md border border-muted mt-6 overflow-hidden bg-card">
      <Table className="w-full">
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-20 text-center">Imagen</TableHead>
            <TableHead className="w-[35%]">Producto</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="w-10 h-10 rounded-md mx-auto" /></TableCell>
                <TableCell>
                  <Skeleton className="w-48 h-4 mb-2" />
                  <Skeleton className="w-24 h-3" />
                </TableCell>
                <TableCell><Skeleton className="w-16 h-4 ml-auto" /></TableCell>
                <TableCell><Skeleton className="w-10 h-4 mx-auto" /></TableCell>
                <TableCell><Skeleton className="w-24 h-4 ml-auto" /></TableCell>
                <TableCell><Skeleton className="w-8 h-8 rounded-full" /></TableCell>
              </TableRow>
            ))
          ) : (
            data?.map(product => {
              const stockColor = product.stock <= product.min_stock
                ? "text-red-500 bg-red-50 dark:bg-red-950/30"
                : product.stock <= product.min_stock + 5 ? "text-amber-500 bg-amber-100 dark:bg-amber-950/30"
                  : "text-green-700 bg-green-100 dark:text-green-500 dark:bg-green-900/30";
              return (
                <TableRow key={product.id} className="group transition-colors">
                  <TableCell className="text-center">
                    {product.image ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => onView(product)}
                      >
                        <img src={product.image} alt={`imagen del producto ${product.name}`} />
                      </div>
                    ) : (
                      <div
                        onClick={() => onView(product)}
                        className="size-10 mx-auto rounded-lg bg-linear-to-br from-muted to-muted/50 flex 
                    items-center justify-center border border-muted-foreground/10 cursor-pointer"
                      >
                        <Image className="size-5 text-muted-foreground opacity-70" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground/90 leading-none mb-1">
                        {product.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground tracking-tighter uppercase">
                        SKU-{product.sku || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">
                    ${product.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${stockColor}`}>
                      {product.stock} <span className="text-xs">{product.unit}s</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-black text-foreground">
                      ${(product.price * product.stock).toLocaleString()}
                    </span>
                    <span className="text-[9px] ml-1 text-muted-foreground font-normal">MXN</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Can roles={["owner", "admin", "stock-man"]}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(product)}>
                              <PencilIcon />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAdjust(product)}>
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
                    </Can>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
        <TableFooter className="bg-muted/20">
          <TableRow>
            <TableCell colSpan={4} className="text-right font-semibold py-4">Total Inventario</TableCell>
            <TableCell className="text-right font-black text-lg text-primary-light py-4">
              ${totalInventario.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">MXN</span>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div >
  );
}