'use client'
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/animate-ui/components/animate/tabs";
import AddProduct from "@/features/inventory/components/AddProduct";
import { ListDashesIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Categorie, Product } from "@/shared/types";
import { useDebounce } from 'use-debounce'
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { useInventoryModals } from "@/features/inventory/hooks/useInventoryModals";
import InventoryModals from "@/features/inventory/components/InventoryModals";
import InventoryFilters from "@/features/inventory/components/InventoryFilters";
import InventoryContent from "@/features/inventory/components/InventoryContent";
import InventoryPagination from "@/features/inventory/components/InventoryPagination";

interface ProductsData {
  data: Product[];
  page: number;
  pageSize: number;
  total: number
}

export default function InventarioPage() {
  const [view, setView] = useState("table")
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [debouncedSearch] = useDebounce(search, 500);
  const { modal, openAdjust, openDelete, openEdit, openView, closeModal } = useInventoryModals();
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

  const totalPages = Math.ceil((data?.total || 0) / pageSize);
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
      <InventoryFilters
        search={search}
        onSearchChange={setSearch}
        selectedCategorie={selectedCategorie}
        onCategoryChange={setSelectedCategorie}
        categories={categories}
        categoriesLoading={catLoading}
        products={data?.data}
      />
      <div className="mt-6">
        <InventoryContent
          isLoading={isLoading}
          products={data?.data}
          view={view}
          totalInventario={totalInventario}
          onEdit={openEdit}
          onDelete={openDelete}
          onView={openView}
          onAdjust={openAdjust}
        />

        <InventoryPagination
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
      <InventoryModals
        modal={modal}
        onClose={closeModal}
      />
    </div>
  )
}
