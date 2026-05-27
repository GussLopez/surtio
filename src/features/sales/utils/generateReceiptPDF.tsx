import { pdf } from "@react-pdf/renderer";
import ReceiptPDFDocument from "./ReceiptPDFDocument";
import type { Sale } from "@/types";

export async function generateReceiptPDF(sale: Sale, businessName: string) {
  const blob = await pdf(<ReceiptPDFDocument sale={sale} businessName={businessName} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Recibo_${sale.sale_number}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
