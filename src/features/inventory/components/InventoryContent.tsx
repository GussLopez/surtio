import { ArrowUpCircle, PackageSearch, Plus } from "lucide-react";
import { Spinner } from "@/shared/components/ui/spinner";
import { Product } from "@/shared/types";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import { Button } from "@/shared/components/ui/button";

interface InventoryContentProps {
  isLoading: boolean;
  products?: Product[];
  view: string;
  totalInventario: number;

  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onAdjust: (product: Product) => void;
}

export default function InventoryContent({
  isLoading,
  products,
  view,
  totalInventario,
  onEdit,
  onDelete,
  onView,
  onAdjust,
}: InventoryContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-70">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center  gap-2 mx-auto py-10">
        <div className="p-2 rounded-lg text-primary bg-primary/10">
          <PackageSearch size={30} />
        </div>

        <p className="font-medium text-accent-foreground">
          Aún no hay productos
        </p>

        <p className="text-sm/relaxed text-center text-muted-foreground px-6">
          Aún no has creado ningún producto. Empieza creando tu primer producto.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Button variant={'outline'}>
            <ArrowUpCircle />
            Importar productos
          </Button>
          <Button>
            <Plus />
            Agregar Producto
          </Button>

        </div>
      </div>
    );
  }

  if (view === "table") {
    return (
      <ProductTable
        data={products}
        totalInventario={totalInventario}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onAdjust={onAdjust}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onAdjust={onAdjust}
        />
      ))}
      <div className="fixed bottom-10 right-10 px-5 py-3 border border-input shadow-lg rounded-lg bg-white dark:bg-black z-10">
        <p className="font-semibold">Total Inventario</p>
        <p className="font-black text-lg text-primary-light">
          ${totalInventario.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">MXN</span>
        </p>
      </div>
    </div>
  );
}