import { Sale } from "@/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../shared/components/ui/dialog";
import { DownloadSimpleIcon, StorefrontIcon, UserIcon } from "@phosphor-icons/react";
import { Badge } from "../../../shared/components/ui/badge";
import { CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/components/ui/table";
import { Separator } from "../../../shared/components/ui/separator";
import { Button } from "../../../shared/components/ui/button";
import { generateReceiptPDF } from "@/features/sales/utils/generateReceiptPDF";
import { useState } from "react";
import { useBusinessStore } from "@/shared/store/BusinessStore";

interface SaleReceiptProps {
  open: boolean;
  sale: Sale;
  onClose: () => void;
}

export default function SaleReceipt({ open, sale, onClose }: SaleReceiptProps) {
  const businessName = useBusinessStore(state => state.name)
  const [downloading, setDownloading] = useState(false);
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateReceiptPDF(sale, businessName!);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = new Date(sale.created_at!)
    .toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })

  const formatTime = new Date(sale.created_at!)
    .toLocaleTimeString("es-MX", {
      hour: "numeric",
      minute: "numeric"
    })

  const totalCost = sale.sale_items.reduce((total, item) => {
    return total + (item.products.cost * item.quantity)
  }, 0)

  const totalRevenue = sale.sale_items.reduce((total, item) => {
    return total + ((item.price - item.products.cost) * item.quantity)
  }, 0)
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pt-1 flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 text-primary rounded-xl bg-primary/10 ">
              <StorefrontIcon size={40} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{businessName}</DialogTitle>
              <DialogDescription>Recibo de venta</DialogDescription>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-end">
            <Badge
              variant={'secondary'}
              className="font-mono "
            >
              {sale.sale_number}
            </Badge>
            <p className="mt-2 mb-1">{formatDate}</p>
            <p>{formatTime}</p>
          </div>
        </DialogHeader>
        <div>
          <div className="w-full grid grid-cols-2 gap-5 p-4 rounded-md bg-facent">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon size={17} weight="bold" />
                <p className="uppercase tracking-wide font-semibold text-xs">Cliente</p>
              </div>
              <p className="mt-3 font-semibold text-lg">Cliente Anónimo</p>
            </div>
            <div className="text-sm space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard size={17} />
                <p className="uppercase tracking-wide font-semibold text-xs">Detalles</p>
              </div>
              <div className="text-muted-foreground">
                <div className="flex justify-between">
                  <span>Vendedor:</span>
                  <span className="font-medium text-black dark:text-white">{sale.seller_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Método de Pago:</span>
                  <span className="font-medium text-black dark:text-white">{sale.payment_method === "cash" && 'Efectivo'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Completada</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-md overflow-hidden border border-input ">
            <Table>
              <TableHeader>
                <TableRow className="bg-facent">
                  <TableHead className="px-4">Producto</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead className="text-end px-4">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-h-20 overflow-y-hidden">
                {sale.sale_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.products.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</TableCell>
                    <TableCell>${item.products.cost.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} MXN</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-12 mt-4">

            <div className="col-start-6 col-span-7 p-5 rounded-lg bg-facent">
              <div className="text-sm flex justify-between">
                <span className="text-muted-foreground">Costo total:</span>
                <span className="font-medium">{totalCost.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} MXN</span>
              </div>
              <Separator className="w-full h-px my-3" />
              <div className="flex justify-between">
                <span className="text-lg font-bold uppercase">Total</span>
                <span className="text-2xl font-bold text-primary-light">
                  $ {sale.total.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} MXN
                </span>
              </div>
              <Separator className="w-full h-px my-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold uppercase tracking-wider text-emerald-600 dark:text-green-400">Ganancia neta</span>
                <span className="font-bold text-emerald-600 dark:text-green-400">
                  $ {totalRevenue.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} MXN
                </span>
              </div>

            </div>
          </div>
        </div>
        <DialogFooter className="justify-between!">
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
          <Button onClick={handleDownloadPDF} disabled={downloading}>
            <DownloadSimpleIcon size={20} weight="bold" />
            {downloading ? "Generando..." : "Descargar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
