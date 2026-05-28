import { pdf } from "@react-pdf/renderer";
import type { Sale } from "@/shared/types";
import SalesHistoryPDFDocument from "./SalesHistoryPDFDocument";

interface DateRange {
  from?: Date;
  to?: Date;
}

export async function generateSalesHistoryPDF(sales: Sale[], dateRange?: DateRange) {
  const blob = await pdf(
    <SalesHistoryPDFDocument sales={sales} dateRange={dateRange} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  
  // Generate filename based on date range
  const filename = dateRange?.from && dateRange?.to
    ? `ventas-${dateRange.from.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" })}-${dateRange.to.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" })}.pdf`
    : `ventas-${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" })}.pdf`;
  
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}