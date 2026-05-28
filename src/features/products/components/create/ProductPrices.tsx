import { Input } from "@/shared/components/ui/input";
import { TrendUpIcon } from "@phosphor-icons/react";
import { ProductForm } from "../../types/products.types";

interface ProductPricesProps {
  formData: ProductForm;
  onChange: (data: any) => void;
}
export default function ProductPrices({ formData, onChange }: ProductPricesProps) {
  const profit = (formData.price ?? 0) - (formData.cost ?? 0);
  const isProfit = profit >= 0;
  return (

    <div className="lg:grid lg:grid-cols-2 gap-3 p-2">
      <div>
        <label htmlFor="productCost" className="font-semibold text-xs">Costo</label>
        <Input
          id="productCost"
          placeholder="$"
          type="number"
          onChange={e => onChange({ cost: e.target.value })}
          value={formData.cost}
        />
      </div>
      <div>
        <label htmlFor="productPrice" className="font-semibold text-xs">Precio de venta</label>
        <Input
          id="productPrice"
          placeholder="$"
          type="number"
          onChange={e => onChange({ price: e.target.value })}
          value={formData.price}
        />
      </div>
      <div className="col-span-2 flex justify-between px-3 py-4 mt-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendUpIcon size={20} weight="bold" className={`${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`} />
          Ganancia Estimada (MXN)
        </div>
        <div className={`text-end ${isProfit ? 'text-green-700 dark:text-green-400' : 'text-red-700'}`}>
          <p className="font-semibold text-xs">
            {formData.price && formData.cost ? (formData.price - formData.cost).toFixed(2) : (0).toFixed(2)} MXN
          </p>
          <p className="text-xs">
            {formData.price && formData.cost ? (((formData.price / formData.cost) - 1) * 100).toFixed(2) : 0.00}% Margen
          </p>
        </div>
      </div>
    </div>
  )
}
