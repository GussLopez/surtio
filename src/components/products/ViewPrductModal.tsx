import { Barcode, ClipboardCheck, ClipboardX, FileText, Image } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "../animate-ui/components/animate/tabs";
import { Product } from "@/types";
import { CubeIcon, StackIcon, StackMinusIcon, TagIcon, TextboxIcon, TrendUpIcon } from "@phosphor-icons/react";
import { Badge } from "../ui/badge";
interface ProductModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function ViewProductModal({ open, onClose, product }: ProductModalProps) {
  const profit = (product?.price ?? 0) - (product?.cost ?? 0);
  const isProfit = profit >= 0;

  const lowStock = (product?.stock ?? 0) <= (product?.min_stock ?? 0)
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="p-0 gap-0 overflow-hidden">
        <DialogHeader className="border-b">
          <div className="relative w-full bg-facent h-52 sm:h-60 flex items-center justify-center shrink-0  group">
            {product?.image ? (
              <img
                src={product.image}
                alt={`imagen de ${product.name}`}
                className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Image className="size-10 opacity-60" />
                <span className="text-xs uppercase tracking-wider font-semibold opacity-60">
                  Sin imagen
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-4 right-4 z-10">
              <DialogTitle className="w-fit px-3 py-1 text-xl sm:text-2xl font-bold rounded-md bg-background/70 backdrop-blur-sm">
                {product?.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <Tabs className="gap-0 px-2 mt-2">
          <TabsList className="w-full">
            <TabsTrigger value={'general'}>General</TabsTrigger>
            <TabsTrigger value={'precios'}>Precios</TabsTrigger>
            <TabsTrigger value={'inventario'}>Inventario</TabsTrigger>
            <TabsTrigger value={'detalles'}>Detalles</TabsTrigger>
          </TabsList>
          <TabsContents>
            <TabsContent value="general">
              <div className="p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-cyan-500" />
                    <p className="font-semibold text-gray-700 dark:text-neutral-200">Descripción</p>
                  </div>
                  <DialogDescription className="w-full h-20 mt-2 px-4 py-2 rounded-md text-sm text-gray-700 dark:text-neutral-400 line-clamp-2 bg-muted/50">
                    {product?.description}
                  </DialogDescription>
                </div>
                <div className="mt-4 font-medium">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2">
                      <TagIcon size={20} />
                      <p>Categoría</p>
                    </div>

                    <p className={`font-normal text-sm ${product?.model ? 'font-medium' : 'italic text-gray-500'}`}>
                      {product?.categories?.name || 'No disponible'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2">
                      <CubeIcon size={20} />
                      <p>Marca</p>
                    </div>

                    <p className="font-normal text-sm italic text-gray-500">No disponible</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <TextboxIcon size={20} />
                      <p>Modelo</p>
                    </div>

                    <p
                      className={`font-normal text-sm ${product?.model ? 'font-medium' : 'italic text-gray-500'}`}>
                      {product?.model ? product.model : 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="precios">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Costo del Producto</p>
                    <p className="text-xl font-bold mt-1.5">$ {product?.cost.toLocaleString()} MXN</p>
                  </div>
                  <div className="p-3 rounded-md text-end bg-muted/50">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Precio de Venta</p>
                    <p className="text-xl font-bold mt-1.5 text-primary-light">$ {product?.price.toLocaleString()} MXN</p>
                  </div>
                </div>
                <div className="col-span-2 mt-4 flex justify-between px-3 py-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendUpIcon size={20} weight="bold" className={`${isProfit ? 'text-green-600' : 'text-red-600'}`} />
                    Ganancia Estimada (MXN)
                  </div>
                  <div className={`text-end ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                    <p className="font-semibold text-xs">
                      {product?.price && product?.cost ? (product?.price - product?.cost).toFixed(2) : (0).toFixed(2)} MXN
                    </p>
                    <p className="text-xs">
                      {product?.price && product?.cost ? (((product?.price / product?.cost) - 1) * 100).toFixed(2) : 0.00}% Margen
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="inventario">
              <div className="p-4">
                <div className="grid grid-cols-12 px-2 py-4 bg-muted/50  rounded-md">
                  <div className="col-span-5 grid grid-cols-4 gap-10">
                    <div className="w-11 h-11 p-2 rounded-full bg-primary-light text-white">
                      <StackIcon size={28} weight="duotone" />
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground/70">Stock Actual</p>
                      <p className="text-2xl font-bold">{product?.stock} <span className="text-xs font-medium">UN.</span></p>
                    </div>
                  </div>
                  <div className="col-span-2 col-start-11 flex justify-center items-center">
                    <Badge
                      variant={lowStock ? 'destructive' : 'default'}
                    >{lowStock ? 'Bajo' : 'Normal'}</Badge>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 mt-5 py-3">
                    <div className="flex items-center gap-2 col-span-4 font-medium">
                      <StackMinusIcon size={20} />
                      <p>Stock mínimo</p>
                    </div>

                    <p
                      className={`col-span-4 text-sm text-end pr-3 ${product?.min_stock ? 'font-medium col-start-12' : 'col-start-10 text-end italic text-gray-500'}`}>
                      {product?.min_stock ? product.min_stock : 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="detalles">
              <div className="py-3">
                <div className="grid grid-cols-12 mt-5 py-3 border-b border-input">
                  <div className={`flex items-center pl-3 gap-2 col-span-6 font-medium text-accent-foreground`}>
                    <Barcode size={20} />
                    <p className="">Código de barras</p>
                  </div>
                  <p className={`col-span-4 col-start-9 text-sm text-end pr-3 font-medium 
                    ${!product?.barcode && 'font-normal text-sm italic text-gray-500'}`}>
                    {product?.barcode ? product.barcode : 'No disponible'}
                  </p>
                </div>
                <div className="grid grid-cols-12 mt-5 rounded-md">
                  <div className={`flex items-center pl-3 gap-2 col-span-4 font-medium ${product?.is_active ? 'text-primary-light' : 'text-muted-foreground'}`}>
                    {product?.is_active ? <ClipboardCheck size={20} /> : <ClipboardX size={20} />}
                    <p className="text-accent-foreground">Estatus</p>
                  </div>
                  <p
                    className={`col-span-4 col-start-9 text-sm text-end pr-3 font-medium `}>
                    {product?.is_active ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>

            </TabsContent>
          </TabsContents>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
