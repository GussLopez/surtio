import { Product } from "@/shared/types";
import ProductCard from "./ProductCard";

interface CardViewProps {
  data: Product[]
  isLoading?: boolean;
  totalInventario: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void
  onView: (product: Product) => void
}

export default function CardView({ data, totalInventario, onEdit, onDelete, onView }: CardViewProps) {

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-3">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
