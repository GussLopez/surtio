'use client'
import DeleteSaleDialog from "@/features/sales/components/DeleteSaleDialog";
import EditSaleDialog from "@/features/sales/components/EditSaleDialog";
import CancelSaleDialog from "@/features/sales/components/CancelSaleDialog";
import SaleReceipt from "@/features/sales/components/SaleReceipt";
import { Button } from "@/shared/components/ui/button";
import { RangeDatePicker } from "@/shared/components/ui/range-date";
import { Spinner } from "@/shared/components/ui/spinner";
import { Sale } from "@/shared/types";
import { DownloadSimpleIcon, FileTextIcon } from "@phosphor-icons/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArchiveRestore, ArrowUpCircle, FileClock, List, Plus, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import SalesListView from "@/features/sales/components/SalesListView";
import SalesTableView from "@/features/sales/components/SalesTableView";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { sileo } from "sileo";
import { generateSalesHistoryPDF } from "@/features/sales/utils/generateSalesHisotryPDF";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shared/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils/utils";

type ModalState =
  | { type: "edit"; sale: Sale }
  | { type: "view"; sale: Sale }
  | { type: "delete"; saleId: string }
  | { type: "null"; saleId: string }
  | null

export default function HistorialPage() {
  const [view, setView] = useState('list');
  const [page, setPage] = useState(1);
  const pageSize = 30;
  const [modal, setModal] = useState<ModalState>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const businessId = useBusinessStore(state => state.id)
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["sales-reports", businessId, dateRange, page],
    queryFn: async () => {
      const res = await fetch('/api/sales', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          dateRange,
          page,
          pageSize
        })
      })
      if (!res.ok) throw new Error('Error fetching');
      return res.json();
    },
    enabled: !!businessId,
    retry: 1,
    placeholderData: keepPreviousData
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
  useEffect(() => {
    setPage(1);
  }, [dateRange, businessId]);

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
  const totalPages = Math.ceil((data?.total || 0) / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Historial de Ventas</h1>
      <div className="mt-6 p-4 bg-background rounded-lg shadow-xs">
        <div className={cn(data.data.length === 0 ? 'hidden!' : 'block!', "xl:flex justify-between items-center")}>
          <RangeDatePicker date={dateRange} setDate={setDateRange} />
          <div className="flex gap-2 xl:gap-2 mt-3 xl:mt-0">
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
        <div className="">
          {isLoading && <div className="flex justify-center items-center h-70">
            <Spinner className="size-7" />
          </div>
          }

          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 mx-auto py-10">
              <div className="p-2 rounded-lg text-primary bg-primary/10">
                <ArchiveRestore size={30} />
              </div>
              <p className="font-medium text-accent-foreground">No hay ventas</p>
              <p className="text-sm/relaxed text-center text-muted-foreground px-6">No se han creado ninguna venta en esta fecha. Empieza creando una venta.</p>
              <div className="flex items-center gap-3 mt-4">
                <Button>
                  <Plus />
                  Crear Venta
                </Button>
              </div>
            </div>
          ) : (
            <>
              {data && view === 'list' && (
                <SalesListView
                  data={data.data}
                  onView={openView}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onNull={openNull}
                />
              )}
              {data && view === 'table' && (
                <SalesTableView
                  data={data.data}
                  onView={openView}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onNull={openNull}
                />
              )}
            </>
          )}
          <div className={cn(data.data.length === 0 ? 'hidden' : 'block')}>
            <Pagination className="justify-end mt-4" >
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {pages.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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
    </div>
  )
}
