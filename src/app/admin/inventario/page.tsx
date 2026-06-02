'use client'
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/animate-ui/components/animate/tabs";
import AddProduct from "@/features/inventory/components/AddProduct";
import ProductTable from "@/features/inventory/components/ProductTable";
import { DownloadSimpleIcon, FileTextIcon, ListDashesIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Box, PackageSearch, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { Categorie, Product } from "@/shared/types";
import EditProductModal from "@/features/inventory/components/EditProductModal";
import ViewProductModal from "@/features/inventory/components/ViewPrductModal";
import { DeleteProduct } from "@/features/inventory/components/DeleteProduct";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useDebounce } from 'use-debounce'
import { sileo } from "sileo";
import { generateProductsPDF } from "@/features/inventory/utils/generateProductsPDF";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shared/components/ui/pagination";
import AdjustStock from "@/features/inventory/components/AdjustStock";
import ProductCard from "@/features/inventory/components/ProductCard";
import ExportProducts from "@/features/inventory/components/ExportProducts";

type ModalState =
  | { type: "edit"; product: Product }
  | { type: "view"; product: Product }
  | { type: "delete"; product: Product }
  | { type: "adjust"; product: Product }
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
  const [debouncedSearch] = useDebounce(search, 500);

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
    setModal({ type: "edit", product });

  const openView = (product: Product) =>
    setModal({ type: "view", product });

  const openDelete = (product: Product) =>
    setModal({ type: "delete", product });

  const openAdjust = (product: Product) =>
    setModal({ type: "adjust", product });


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
        {data && categories && (
          <ExportProducts
            data={data.data}
            categories={categories}
            selectedCategorie={selectedCategorie}
          />
        )}
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
                  onAdjust={openAdjust}
                />}
              {data && view === "card" &&
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-3">
                  {data?.data.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={openEdit}
                      onDelete={openDelete}
                      onView={openView}
                      onAdjust={openAdjust}
                    />
                  ))}
                </div>
              }

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
      {modal?.type === "adjust" && (
        <AdjustStock
          open
          product={modal.product}
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
