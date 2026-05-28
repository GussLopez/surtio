'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Categorie, ProductForm } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, ClipboardX, Plus } from "lucide-react";
import { useState } from "react";
import AddCategorieDialog from "@/shared/components/AddCategorieDialog";

interface ProductDetailsProps {
  formData: ProductForm;
  onChange: (data: any) => void;
}

type ModalState =
  | { type: "create" }
  | null

export default function ProductDetails({ formData, onChange }: ProductDetailsProps) {
  const [isActive, setIsActive] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading } = useQuery<Categorie[]>({
    queryKey: ["business-categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories', {
        method: 'GET'
      })
      
      if (!res.ok) throw new Error('Error fetching categories');

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true
  })

  return (

    <div className="lg:grid lg:grid-cols-2 space-y-2 gap-3 p-2">
      <div>
        <Label htmlFor="productBrand" className="font-semibold text-xs">Marca</Label>
        <Input id="productBrand" placeholder="Marca" />
      </div>
      <div>
        <Label htmlFor="productModel" className="font-semibold text-xs">Modelo</Label>
        <Input
          id="productModel"
          placeholder="Modelo"
          type="text"
          onChange={e => onChange({ model: e.target.value })}
          value={formData.model!}
        />
      </div>
      <div>
        <Label htmlFor="unit" className="font-semibold text-xs">Presentacion</Label>
        <Input
          id="unit"
          placeholder="pieza, 100 g, 2 kg, 400 ml"
          onChange={e => onChange({ unit: e.target.value })}
          value={formData.unit!}
        />
      </div>
      <div>
        <Label htmlFor="unit" className="font-semibold text-xs">Categoria</Label>
        <div className="flex gap-2">
          <Select
            value={formData.category_id?.toString() || 'ninguno'}
            onValueChange={(value) => {
              if (value === 'ninguno') {
                onChange({ category_id: null })
              } else {
                onChange({ category_id: Number(value) })
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>
                <SelectItem value="ninguno" defaultChecked>Ninguno</SelectItem>
                {isLoading && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                {data?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
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
      <label
        htmlFor="isActive"
        className="h-9.5 flex justify-between items-center px-3 rounded-md border border-input has-data-[state=checked]:border-primary/50 relative transition duration-300"
      >
        <span className="flex items-center gap-2 text-xs font-medium">
          {isActive ? <ClipboardCheck size={20} /> : <ClipboardX size={20} />}
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
          onClick={() => onChange({ is_active: isActive })}
        />

      </label>

      {modal?.type === "create" && (
        <AddCategorieDialog
          open
          onClose={() => setModal(null)}
          onCraeted={(categorie) => {
            onChange({ category_id: categorie.id })
          }}
        />
      )}
    </div>
  )
}
