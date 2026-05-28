'use client';
import InputQuantity from "@/features/sales/components/InputQuantity";
import SearchProductInput from "@/features/sales/components/SearchProductInput";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Plus, SquarePen, Trash } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessStore } from "@/store/BusinessStore";
import { useUserStore } from "@/store/UserStore";
import { Product, Supplier } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { NumberField } from "react-aria-components";
import { sileo } from "sileo";
import { AnimatePresence } from "motion/react";
import AddSupplierDialog from "@/shared/components/AddSupplierDialog";

interface ItemsProps {
  tempId: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
}

interface MovementInsert {
  product_id: string;
  business_id: string;
  quantity: number;
  type: "entrada" | "salida" | "ajuste";
  user_id?: string | null;
  supplier_id?: number | null;
  reference?: string | null;
  batch_id: string;
}

export default function RegisterMovement() {
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notes, setNotes] = useState('');
  const [popover, setPopover] = useState(false);
  const [suppModal, setSuppModal] = useState(false);

  const [supplierId, setSupplierId] = useState<number | null>(null)
  const userId = useUserStore((state) => state.id);
  const businessId = useBusinessStore((state) => state.id);

  const addItem = (product: Product) => {
    setItems([
      ...items,
      {
        tempId: crypto.randomUUID(),
        product_id: product.id || '',
        product_name: product.name || '',
        product_sku: product.sku || '',
        quantity: 1,
      }
    ])
  }

  useEffect(() => {
    if (selectedProduct) {
      addItem(selectedProduct);
      setSelectedProduct(null);
    }
  }, [selectedProduct])

  const updateQuantity = (tempId: string, newQuantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.tempId === tempId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const deleteItem = (tempId: string) => {
    setItems(prev =>
      prev.filter(item => item.tempId !== tempId)
    )
  }

  const validateNotes = () => {
    if (notes.length === 0) return;
    if (notes.length < 8) {
      sileo.warning({
        title: 'La nota debe ser más larga',
        description: 'La nota debe ser mayor a 8 caracteres'
      })
      setNotes('')
    }

    setPopover(false);
  }
  const handleSave = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const operationId = crypto.randomUUID();
      const movementsToSave: MovementInsert[] = items.map(item => ({
        product_id: item.product_id,
        business_id: businessId || '',
        user_id: userId,
        quantity: item.quantity,
        type: 'entrada',
        reference: notes,
        supplier_id: supplierId,
        batch_id: operationId
      }))

      const res = await fetch('/api/movements', {
        method: 'POST',
        body: JSON.stringify({
          movements: movementsToSave
        })
      });
      if (!res.ok) {
        throw new Error("Error fetching");
      }
      sileo.success({
        title: 'Movimientos registrados',
        description: 'Los movimientos se registraron correctamente',
        autopilot: false
      })
      setItems([]);
    } catch (error) {
      console.error(error);
      sileo.error({
        title: 'Error al registrar los movimientos',
        description: 'Hubo un error al registrar los movimientos, por favor intente más tarde'
      })
    } finally {
      setLoading(false);
    }
  }

  const { data, isLoading } = useQuery<Supplier[]>({
    queryKey: ["business-suppliers", businessId],
    queryFn: async () => {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          active: true
        })
      });

      return res.json();
    },
    retry: 1,
    enabled: !!businessId
  })
  return (
    <div>
      <div className="mt-5 lg:mt-10 flex gap-4">
        <div className="max-w-sm w-full">
          <div className="flex gap-2">
            <Select
              value={supplierId?.toString() || 'ninguno'}
              onValueChange={(value) => setSupplierId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Proveedores</SelectLabel>
                  <SelectItem value="ninguno" defaultChecked>Ninguno</SelectItem>
                  {isLoading && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                  {data?.map((supp) => (
                    <SelectItem key={supp.id} value={supp.id.toString()}>{supp.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              size={'icon'}
              variant={'outline'}
              onClick={() => setSuppModal(true)}
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>
        <div>
          <Popover open={popover} onOpenChange={setPopover}>
            <PopoverTrigger asChild>
              <Button variant={'outline'}>
                <SquarePen size={20} className="text-green-600 dark:text-green-400" />
                Agregar Nota
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-85 p-0">
              <Textarea
                placeholder="Detalles adicionales..."
                className="min-h-20 max-h-50 p-4 focus-visible:ring-0 border-0 shadow-none"
                onChange={e => setNotes(e.target.value)}
                value={notes}
              />
              <Separator className="w-full h-px" />
              <div className="flex items-center justify-between px-3 py-2">
                <Button
                  variant={'ghost'}
                  size={'icon-sm'}
                  onClick={() => setPopover(false)}
                >
                  <ArrowLeft size={20} />
                  <span className="sr-only">Cerrar menu de notas</span>
                </Button>
                <Button
                  size={'sm'}
                  variant={'outline'}
                  onClick={validateNotes}
                >
                  Guardar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-4 border border-input rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead className="text-end">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <TableRow
                  key={item.tempId}
                  className="bg-background"
                >
                  <TableCell className="text-lg font-semibold">
                    {item.product_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={'secondary'} className="font-mono">{item.product_sku}</Badge>
                  </TableCell>
                  <TableCell className="max-w-15 overflow-hidden">
                    <NumberField
                      aria-label="Cantidad del producto"
                      value={item.quantity}
                      minValue={1}
                      maxValue={999}
                      onChange={(value) =>
                        updateQuantity(item.tempId, value)
                      }
                      className='w-full max-w-xs space-y-2'
                    >
                      <InputQuantity />
                    </NumberField>

                  </TableCell>
                  <TableCell className="text-end">
                    <Button
                      variant={'ghost'}
                      className="bg-red-600/10 text-red-500"
                      size={'icon-sm'}
                      onClick={() => deleteItem(item.tempId)}
                    >
                      <Trash size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
            <TableRow>
              <TableCell colSpan={5}>
                <SearchProductInput
                  setProduct={setSelectedProduct}
                  btnClass="w-full max-w-fit justify-between"
                  btnSize="sm"
                  placeholder="Seleccionar producto"
                />
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-end">
                <Button
                  disabled={items.length === 0 || loading}
                  onClick={handleSave}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Registrando
                    </>
                  ) : 'Registrar Movimiento'}
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <AddSupplierDialog
        open={suppModal}
        onClose={() => setSuppModal(false)}
        onCraeted={(supplier) => {
          setSupplierId(supplier.id)
        }}
      />
    </div>
  )
}
