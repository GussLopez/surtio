'use client'
import { Sale } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ReceiptIcon, TrendUpIcon } from "@phosphor-icons/react";
import { Button } from "../../../shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Ban, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";

interface SaleTableProps {
  data: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
  onNull: (saleId: string) => void;
}

export default function SalesTableView({ data, onView, onEdit, onDelete, onNull }: SaleTableProps) {

  return (
    <div className="border border-muted rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Venta</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead className="text-end">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sale) => {
            const formatDate = new Date(sale.created_at!)
              .toLocaleDateString('es-MX', {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            const totalItems = sale.sale_items.reduce((acc, item) => {
              return acc + item.quantity;
            }, 0)
            const totalProfit = sale.sale_items.reduce((acc, item) => {
              const profitPerItem = (item.price - item.products.cost) * item.quantity;
              return acc + profitPerItem
            }, 0)
            return (
              <TableRow key={sale.id} className="group">
                <TableCell className="font-mono text-xs tracking-wide">#{sale.sale_number}</TableCell>
                <TableCell>{formatDate}</TableCell>
                <TableCell>{sale.seller_name}</TableCell>
                <TableCell>
                  {sale.sale_items.length} productos
                  <span className="block text-xs tracking-wide text-muted-foreground">({totalItems} items)</span>
                </TableCell>
                <TableCell className="max-w-20 font-semibold tracking-wide text-end">
                  $ {sale.total.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  <div className="flex items-center justify-end gap-1.5 font-light text-xs text-green-600 dark:text-green-400">
                    <TrendUpIcon size={15} weight="bold" />
                    <span>
                      $ {totalProfit.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-end w-20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 xl:opacity-0 xl:group-hover:opacity-100 xl:transition-opacity">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(sale)}>
                          <ReceiptIcon />
                          Recibo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(sale)}>
                          <PencilIcon />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNull(sale.id)}>
                          <Ban />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup onClick={() => onDelete(sale.id)}>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
