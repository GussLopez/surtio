import { pdf } from "@react-pdf/renderer";
import ProductsPDFDocument from "./ProductsPDFDocument";
import type { Product } from "@/shared/types";

export async function generateProductsPDF(products: Product[], categoryFilter?: string) {
  const blob = await pdf(
    <ProductsPDFDocument products={products} categoryFilter={categoryFilter} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const date = new Date().toISOString().split("T")[0];
  link.download = `Inventario_${date}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}