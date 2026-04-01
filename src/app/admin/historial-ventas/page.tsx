'use client'
import DeleteSaleDialog from "@/components/sales/DeleteSaleDialog";
import EditSaleDialog from "@/components/sales/EditSaleDialog";
import CancelSaleDialog from "@/components/sales/CancelSaleDialog";
import SaleReceipt from "@/components/sales/SaleReceipt";
import { Button } from "@/components/ui/button";
import { RangeDatePicker } from "@/components/ui/range-date";
import { Spinner } from "@/components/ui/spinner";
import { getSales } from "@/lib/services/salesService";
import { Sale } from "@/types";
import { DownloadSimpleIcon, FileTextIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { ArchiveRestore, FileClock, List, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/animate/tabs";
import SalesListView from "@/components/sales/SalesListView";
import SalesTableView from "@/components/sales/SalesTableView";
import { useBusinessStore } from "@/store/BusinessStore";
import { sileo } from "sileo";
import { generateSalesHistoryPDF } from "@/lib/generateSalesHisotryPDF";
type ModalState =
  | { type: "edit"; sale: Sale }
  | { type: "view"; sale: Sale }
  | { type: "delete"; saleId: string }
  | { type: "null"; saleId: string }
  | null

export default function HistorialPage() {
  const [view, setView] = useState('list')
  const [modal, setModal] = useState<ModalState>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const businessId = useBusinessStore(state => state.id)
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["sales-reports", dateRange],
    queryFn: async () => {
      const data = await getSales(dateRange);
      return data;
    },
    retry: 1,
  })

  useEffect(() => {
    const savedView = localStorage.getItem("sales-history-view")
    if (savedView) {
      setView(savedView)
    }
  }, [])

  const handleValueChange = (value: string) => {
    setView(value);
    localStorage.setItem('sales-history-view', value);
  }

  const openEdit = (sale: Sale) =>
    setModal({ type: "edit", sale })

  const openView = (sale: Sale) =>
    setModal({ type: "view", sale })

  const openDelete = (saleId: string) =>
    setModal({ type: "delete", saleId })

  const openNull = (saleId: string) =>
    setModal({ type: "null", saleId })

  const handleDownloadPDF = async () => {
    if (!data || data.length === 0) {
      sileo.warning({
        title: 'No hay datos para exportar'
      });
      return;
    }
    setPdfLoading(true);
    try {
      await generateSalesHistoryPDF(data, dateRange);
    } catch (error) {
      console.error(error);
      sileo.error({
        title: 'Error al exportar los datos',
        description: 'Ocurrió un error al exportar los datos en PDF, por favor intenta más tarde'
      })
    } finally {
      setPdfLoading(false);
    }
  }

  const handleDownloadCsv = async () => {
    if (!data || data.length === 0) {
      sileo.warning({
        title: 'No hay datos para exportar'
      });
      return;
    }
    setCsvLoading(true);
    const params = new URLSearchParams({
      from: dateRange?.from?.toISOString() ?? "",
      to: dateRange?.to
        ? new Date(dateRange.to.setHours(23, 59, 59, 999)).toISOString()
        : "",
      business_id: businessId!
    });

    const res = await fetch(`/api/export-sales?${params.toString()}`);

    if (!res.ok) {
      const err = await res.json();
      alert(err.error);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = dateRange?.from && dateRange.to ? `ventas-${dateRange?.from?.toLocaleDateString('es-MX', {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    })}-${dateRange?.to?.toLocaleDateString('en-MX', {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    })}.csv` : 'ventas.csv'
    a.click();
    setCsvLoading(false);
  };
  return (
    <div>
      <div className="flex items-center gap-3">
        <FileClock size={30} className='text-primary-light' />
        <h1 className="text-3xl font-semibold">Historial de Ventas</h1>
      </div>
      <div className="flex justify-between items-center mt-6">
        <RangeDatePicker date={dateRange} setDate={setDateRange} />
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={handleValueChange}>
            <TabsList>
              <TabsTrigger value='list'>
                <List size={20} />
                Lista
              </TabsTrigger>
              <TabsTrigger value='table'>
                <Table size={20} />
                Tabla
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant={'outline'}
            disabled={!data || data?.length === 0 || pdfLoading}
            onClick={handleDownloadPDF}
          >
            {pdfLoading ? <Spinner /> : <FileTextIcon size={20} weight="bold" />}
            {pdfLoading ? "Generando" : "PDF Lista"}
          </Button>
          <Button
            variant={'outline'}
            disabled={!data || data?.length === 0 || csvLoading}
            onClick={handleDownloadCsv}
          >
            {csvLoading ? <Spinner /> : <DownloadSimpleIcon size={20} weight="bold" />}
            CSV
          </Button>
        </div>
      </div>
      <div className="mt-5">
        {isLoading && <div className="flex justify-center items-center py-10">
          <Spinner className="size-7" />
        </div>
        }

        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center max-w-sm gap-2 mx-auto py-10">
            <div className="p-2 rounded-lg text-primary bg-primary/10">
              <ArchiveRestore size={30} />
            </div>
            <p className="font-medium text-accent-foreground">No hay ventas</p>
            <p className="text-sm/relaxed text-center text-muted-foreground px-6">No se han creado ninguna venta en esta fecha. Empieza creando una venta.</p>
          </div>
        ) : (
          <>
            {data && view === 'list' && (
              <SalesListView
                data={data}
                onView={openView}
                onEdit={openEdit}
                onDelete={openDelete}
                onNull={openNull}
              />
            )}
            {data && view === 'table' && (
              <SalesTableView
                data={data}
                onView={openView}
                onEdit={openEdit}
                onDelete={openDelete}
                onNull={openNull}
              />
            )}
          </>
        )}
      </div>
      {modal?.type === "view" && (
        <SaleReceipt
          open
          sale={modal.sale}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "edit" && (
        <EditSaleDialog
          open
          sale={modal.sale}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteSaleDialog
          open
          saleId={modal.saleId}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "null" && (
        <CancelSaleDialog
          open
          saleId={modal.saleId}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
