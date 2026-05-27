'use client'
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/animate/tabs";
import AddProduct from "@/components/products/AddProduct";
import ProductTable from "@/components/products/ProductTable";
import { DownloadSimpleIcon, FileTextIcon, ListDashesIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Box, PackageSearch, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import CardView from "@/components/products/CardView";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Categorie, Product } from "@/types";
import EditProductModal from "@/components/products/EditProductModal";
import ViewProductModal from "@/components/products/ViewPrductModal";
import { DeleteProduct } from "@/components/products/DeleteProduct";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from 'use-debounce'
import { sileo } from "sileo";
import { generateProductsPDF } from "@/lib/generateProductsPDF";
import { useBusinessStore } from "@/store/BusinessStore";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type ModalState =
  | { type: "edit"; product: Product }
  | { type: "view"; product: Product }
  | { type: "delete"; product: Product }
  | null

interface ProductsData {
  data: Product[];
  page: number;
  pageSize: number;
  total: number
}

export default function InventarioPage() {
  const [view, setView] = useState("table")
  const [modal, setModal] = useState<ModalState>(null);
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const businessName = useBusinessStore(state => state.name);
  const [debouncedSearch] = useDebounce(search, 500);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const businessId = useBusinessStore(state => state.id);

  useEffect(() => {
    const savedView = localStorage.getItem("inventory-view")
    if (savedView) {
      setView(savedView)
    }
  }, [])

  const handleChange = (value: string) => {
    setView(value)
    localStorage.setItem("inventory-view", value)
  }

  const { data, isLoading, error } = useQuery<ProductsData>({
    queryKey: ["stock-products", selectedCategorie, debouncedSearch, businessId, page],
    queryFn: async () => {
      const res = await fetch('/api/products/list', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          categoryId: selectedCategorie === 'all' ? undefined : Number(selectedCategorie),
          search: debouncedSearch,
          page,
          pageSize
        })
      })
      if (!res.ok) throw new Error("Error fetching")

      return res.json()
    },
    retry: 1,
    enabled: !!businessId,
    placeholderData: keepPreviousData
  })

  const { data: categories, isLoading: catLoading } = useQuery<Categorie[]>({
    queryKey: ["business-categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories', {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true
  })
  const totalInventario = data?.data.reduce((acc, product) => {
    return acc + (product.price * product.stock);
  }, 0) || 0;

  const openEdit = (product: Product) =>
    setModal({ type: "edit", product })

  const openView = (product: Product) =>
    setModal({ type: "view", product })

  const openDelete = (product: Product) =>
    setModal({ type: "delete", product })

  const handleDownloadPDF = async () => {
    if (!data || data.data.length === 0) {
      sileo.warning({
        title: 'No hay datos para exportar'
      });
      return;
    }
    setPdfLoading(true);
    try {
      const categoryName = categories?.find(c => c.id.toString() === selectedCategorie)?.name;
      await generateProductsPDF(data.data, businessName!, categoryName || selectedCategorie);
    } catch (error) {
      sileo.error({
        title: 'Error al descargar el pdf',
        description: 'Ocurrió un error al descargar el PDF, por favor intenta más tarde'
      })
    } finally {
      setPdfLoading(false)
    }
  }
  const totalPages = Math.ceil((data?.total || 0) / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  useEffect(() => {
    setPage(1);
  }, [selectedCategorie, businessId]);
  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between">
        <div className="flex items-center gap-3">
          <Box size={30} />
          <h1 className="text-3xl font-semibold">Inventario</h1>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={handleChange}>
            <TabsList>
              <TabsTrigger value="table">
                <ListDashesIcon />
                Tabla
              </TabsTrigger>
              <TabsTrigger value="card">
                <SquaresFourIcon />
                Tarjetas
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <AddProduct />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto, SKU..."
              className="lg:min-w-60 pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                <SelectLabel>Categorías</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                {catLoading && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 mt-3 lg:mt-0">
          <Button
            variant={'outline'}
            disabled={!data || data?.data.length === 0 || pdfLoading}
            onClick={handleDownloadPDF}
          >
            {pdfLoading ? <Spinner /> : <FileTextIcon size={20} weight="bold" />}
            {pdfLoading ? "Generando" : "PDF Lista"}
          </Button>
          <Button
            variant={'outline'}
            disabled={!data || data?.data.length === 0 || csvLoading}
            // onClick={handleDownloadCsv}
          >
            {csvLoading ? <Spinner /> : <DownloadSimpleIcon size={20} weight="bold" />}
            CSV
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-70">
            <Spinner className="size-7" />
          </div>
        ) : (
          data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center max-w-sm gap-2 mx-auto py-10">
              <div className="p-2 rounded-lg text-primary bg-primary/10">
                <PackageSearch size={30} />
              </div>
              <p className="font-medium text-accent-foreground">Aún no hay productos</p>
              <p className="text-sm/relaxed text-center text-muted-foreground px-6">Aún no has creado ningún producto. Empieza creando tu primer producto.</p>
            </div>

          ) : (
            <>
              {data && view === "table" &&
                <ProductTable
                  data={data.data}
                  totalInventario={totalInventario}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onView={openView}
                />}
              {data && view === "card" &&
                <CardView
                  data={data.data}
                  totalInventario={totalInventario}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onView={openView}
                />}
            </>
          ))}
        <div>
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
      {modal?.type === "edit" && (
        <EditProductModal
          open
          product={modal.product}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "view" && (
        <ViewProductModal
          open
          product={modal.product}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteProduct
          open
          productId={modal.product.id}
          onClose={() => setModal(null)}
        />
      )}
      {view === "card" && (
        <div className="fixed bottom-10 right-10 px-5 py-3 border border-input shadow-lg rounded-lg bg-white dark:bg-black z-99">
          <p className="font-semibold">Total Inventario</p>
          <p className="font-black text-lg text-primary-light">
            ${totalInventario.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">MXN</span>
          </p>
        </div>
      )}
    </div >
  )
}
