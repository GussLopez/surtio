import { DownloadSimpleIcon, PrinterIcon, SealCheckIcon } from "@phosphor-icons/react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Sale } from "@/types";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../shared/components/ui/button";
import { useRef, useState } from "react";
import { generateReceiptPDF } from "@/features/sales/utils/generateReceiptPDF";
import { useBusinessStore } from "@/store/BusinessStore";
import { Spinner } from "../../../components/ui/spinner";

interface SaleRecipProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sale: Sale
}

export default function NewSaleReceipt({ open, setOpen, sale }: SaleRecipProps) {
  const [downloading, setDownloading] = useState(false);
  const businessName = useBusinessStore(state => state.name);
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
      await generateReceiptPDF(sale, businessName!);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent ref={printRef}>
        <DialogHeader>
          <DialogTitle
            className="flex justify-center items-center gap-2 pb-5 text-xl border-b border-input text-green-600 dark:text-green-400"
          >
            <SealCheckIcon size={30} />
            ¡Venta Completada!
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="text-center">
            <p className="text-lg font-bold">Business Name</p>
            <p className="text-sm text-accent-foreground">{formatDate}</p>
            <p className="mt-1 text-xs font-medium font-mono text-muted-foreground">ID: {sale?.sale_number}</p>
          </div>

          <div className="p-3 mt-4 rounded-lg bg-facent">
            <div className="flex justify-between items-center">
              <p>Cliente: </p>
              <p>Cliente Anónimo</p>
            </div>
            <Separator className="w-full h-px my-3" />
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Total Pagado</p>
              <p className="text-lg font-bold text-primary-light">
                {(sale?.total).toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} MXN
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              variant={'outline'}
              onClick={handlePrint}
            >
              <PrinterIcon size={20} />
              Imprimir
            </Button>
            <Button
              variant={'secondary'}
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
                  <DownloadSimpleIcon size={20} />
                  PDF
                </>
              )}
            </Button>
          </div>

          <DialogClose asChild>
            <Button
              className="w-full mt-6 bg-primary-light"
              size={'lg'}
            >
              Nueva venta
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
