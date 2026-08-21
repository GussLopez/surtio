import { DownloadSimpleIcon, PrinterIcon, SealCheckIcon } from "@phosphor-icons/react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sale } from "@/shared/types";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { useRef, useState } from "react";
import { generateReceiptPDF } from "@/features/sales/utils/generateReceiptPDF";
import { Spinner } from "@/shared/components/ui/spinner";
import { Check, ChevronDown, Download, Printer, ReceiptText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

interface SaleRecipProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sale: Sale
}

export default function NewSaleReceipt({ open, setOpen, sale }: SaleRecipProps) {
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const formatDate = new Date(sale.created_at!)
    .toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateReceiptPDF(sale);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }
  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogContent ref={printRef} className="p-0">
        <DialogHeader className="p-6 border-b border-input">
          <DialogTitle>¡Listo!</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="w-14 h-14 flex justify-center items-center rounded-full bg-green-600/10 text-green-500">
              <Check className="size-7" />
            </div>
            <p className="text-muted-foreground">Total</p>
            <p className="mt-1 text-5xl font-extrabold">${sale?.total}</p>
          </div>

          <div className="py-4 mt-6 rounded-lg mx-8 border-t border-input">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Spinner />
                    PDF
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Descargar PDF
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'outline'}>
                    Más opciones
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer />
                    Imprimir Ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ReceiptText />
                    Ver detalles de la venta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
