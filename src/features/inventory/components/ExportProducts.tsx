'use client'

import { Button } from "@/shared/components/ui/button";
import { Categorie, Product } from "@/shared/types";
import { useState } from "react";
import { sileo } from "sileo";
import { generateProductsPDF } from "../utils/generateProductsPDF";
import { Spinner } from "@/shared/components/ui/spinner";
import { DownloadSimpleIcon, FileTextIcon } from "@phosphor-icons/react";

interface ExportProductsProps {
  data: Product[];
  categories: Categorie[];
  selectedCategorie: string;
}

export default function ExportProducts({ data, categories, selectedCategorie }: ExportProductsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (data.length === 0) {
      sileo.warning({
        title: 'No hay datos para exportar'
      });
      return;
    }
    setPdfLoading(true);
    try {
      const categoryName = categories?.find(c => c.id.toString() === selectedCategorie)?.name;
      await generateProductsPDF(data, categoryName || selectedCategorie);
    } catch (error) {
      sileo.error({
        title: 'Error al descargar el pdf',
        description: 'Ocurrió un error al descargar el PDF, por favor intenta más tarde'
      })
    } finally {
      setPdfLoading(false)
    }
  }


  return (
    <div className="flex gap-2 mt-3 lg:mt-0">
      <Button
        variant={'outline'}
        disabled={data.length === 0 || pdfLoading}
        onClick={handleDownloadPDF}
      >
        {pdfLoading ? <Spinner /> : <FileTextIcon size={20} weight="bold" />}
        {pdfLoading ? "Generando" : "PDF Lista"}
      </Button>
      <Button
        variant={'outline'}
        disabled={data.length === 0 || csvLoading}
      // onClick={handleDownloadCsv}
      >
        {csvLoading ? <Spinner /> : <DownloadSimpleIcon size={20} weight="bold" />}
        CSV
      </Button>
    </div>
  )
}
