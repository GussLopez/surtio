import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import ExportProducts from "./ExportProducts";
import { Categorie, Product } from "@/shared/types";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  selectedCategorie: string;
  onCategoryChange: (value: string) => void;

  categories?: Categorie[];
  categoriesLoading?: boolean;

  products?: Product[];
}

export default function InventoryFilters({
  search,
  onSearchChange,
  selectedCategorie,
  onCategoryChange,
  categories,
  categoriesLoading,
  products,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between mt-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Buscar producto, SKU..."
            className="lg:min-w-60 pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select
          value={selectedCategorie}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent position="popper" align="start">
            <SelectGroup>
              <SelectLabel>Categorías</SelectLabel>

              <SelectItem value="all">
                Todos
              </SelectItem>

              {categoriesLoading && (
                <p className="p-2 text-sm text-muted-foreground">
                  Cargando...
                </p>
              )}

              {categories?.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id.toString()}
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {products && categories && (
        <ExportProducts
          data={products}
          categories={categories}
          selectedCategorie={selectedCategorie}
        />
      )}
    </div>
  );
}