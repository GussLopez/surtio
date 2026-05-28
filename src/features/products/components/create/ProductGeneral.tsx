import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductForm } from "@/types";
import { Image } from "lucide-react";

interface productGeneralProps {
  formData: ProductForm;
  onChange: (data: any) => void;
}

export default function ProductGeneral({ formData, onChange }: productGeneralProps) {

  return (

    <div className="lg:grid grid-cols-12 lg:gap-4 p-2">
      <div className="w-full lg:w-auto h-60 lg:h-auto lg:col-span-4 flex items-center justify-center border-2 border-dashed rounded-lg text-muted hover:text-gray-300 hover:bg-accent/40 cursor-pointer transition-all duration-300">
        <Image className="size-8"/>
      </div>
      <div className="mt-3 lg:mt-0 lg:col-span-8">
        <div className="lg:grid lg:grid-cols-2 gap-3 space-y-2">
          <div>
            <label htmlFor="sku" className="font-semibold text-xs">SKU</label>
            <Input
              id="sku"
              placeholder="SKU"
              type="text"
              onChange={e => onChange({ sku: e.target.value })}
              value={formData.sku}
            />
          </div>
          <div>
            <label htmlFor="productName" className="font-semibold text-xs">Nombre</label>
            <Input
              id="productName"
              placeholder="Nombre"
              type="text"
              onChange={e => onChange({ name: e.target.value })}
              value={formData.name}
            />
          </div>
        </div>
        <div className="mt-2 lg:mt-0">
          <label htmlFor="description" className="font-semibold text-xs">Descripción</label>
          <Textarea
            id="description"
            className="min-h-20 lg:min-h-40 max-h-40"
            onChange={e => onChange({ description: e.target.value })}
            value={formData.description!}
          />
        </div>
      </div>
    </div>
  )
}
