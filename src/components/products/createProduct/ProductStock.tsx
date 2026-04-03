'use client'

import AddSupplierDialog from "@/components/admin/suppliers/AddSupplierDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBusinessSuppliers } from "@/lib/services/supplierService";
import { useBusinessStore } from "@/store/BusinessStore";
import { ProductForm } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ProductPricesProps {
  formData: ProductForm;
  onChange: (data: any) => void;
}
type ModalState =
  | { type: "create" }
  | null
export default function ProductPrices({ formData, onChange }: ProductPricesProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const businessId = useBusinessStore(state => state.id)

  const { data, isLoading } = useQuery({
    queryKey: ["business-suppliers"],
    queryFn: async () => {
      const data = await getBusinessSuppliers(businessId!)
      return data;
    },
    retry: 1
  })
  
  return (
    <div className="grid grid-cols-2 gap-3 p-2">
      <div>
        <label htmlFor="productStock" className="font-semibold text-xs">Stock</label>
        <Input
          id="productStock"
          placeholder="15"
          type="number"
          min={0}
          onChange={e => onChange({ stock: e.target.value })}
          value={formData.stock}
        />
      </div>
      <div>
        <label htmlFor="minStock" className="font-semibold text-xs">Stock mínimo</label>
        <Input
          id="minStock"
          placeholder="10"
          min={1}
          onChange={e => onChange({ min_stock: e.target.value })}
          value={formData.min_stock}
        />
      </div>
      <div>
        <label htmlFor="maxSotck" className="font-semibold text-xs">Código de barras</label>
        <Input
          id="barcode"
          onChange={e => onChange({ barcode: e.target.value })}
          value={formData.barcode!}
        />
      </div>
      <div>
        <label htmlFor="supplier" className="font-semibold text-xs">Proveedor</label>
        <div className="flex gap-2">
          <Select
            value={formData.supplier_id?.toString() || 'ninguno'}
            onValueChange={(value) => {
              if (value === 'ninguno') {
                onChange({ supplier_id: null })
              } else {
                onChange({ supplier_id: Number(value) })
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Proveedores</SelectLabel>
                <SelectItem value="ninguno" defaultChecked>Ninguno</SelectItem>
                {isLoading && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                {data?.length === 0 ? (
                  <p className="p-2 text-sm  text-muted-foreground">No hay proveedores registrados</p>
                ) : (
                  data?.map((supp) => (
                    <SelectItem key={supp.id} value={supp.id.toString()}>{supp.name}</SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size={'icon'}
            variant={'outline'}
            onClick={() => setModal({ type: "create" })}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {modal?.type === "create" && (
        <AddSupplierDialog
          open
          onClose={() => setModal(null)}
          onCraeted={(supplier) => {
            onChange({ supplier_id: supplier.id })
          }}
        />
      )}
    </div>
  )
}
