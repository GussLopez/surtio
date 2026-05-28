import { Sale } from "@/shared/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../shared/components/ui/dialog";

interface EditSaleProps {
  sale: Sale;
  open: boolean;
  onClose: () => void;
}
export default function EditSaleDialog({ sale, open, onClose }: EditSaleProps) {
  
  return (
  <Dialog open={open} onOpenChange={value => !value && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Venta: {sale.sale_number}</DialogTitle>
        <DialogDescription>Modifica la fecha y productos de esta venta.</DialogDescription> 
      </DialogHeader>
      <div>

      </div>
    </DialogContent>
  </Dialog>  
  )  
}
