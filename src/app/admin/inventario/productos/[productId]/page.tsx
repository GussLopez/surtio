'use client'

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Product } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams } from "next/navigation"

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.productId as string;


  const getProduct = async () => {
    const res = await fetch(`/api/products/${productId}`);

    if (!res.ok) throw new Error('Error fetching');

    return res.json();
  }

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["selected-product"],
    queryFn: getProduct,
    enabled: !!productId
  })
  console.log(product);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Button
              variant={'outline'}
              size={'icon-lg'}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h2 className="text-xl font-medium">Detalle del producto</h2>
          </div>

          <div>
            <Button>
              <Pencil />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 border border-input rounded-lg shadow-xs">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Categoría {product?.categories?.name}</span>
              <h1 className="text-xl font-semibold">{product?.name}</h1>

              <div className="flex gap-3 text-xs font-medium text-muted-foreground">
                {product?.sku && <span>SKU: {product?.sku}</span>}
                {product?.barcode && <span>Cód. de Barras: {product?.barcode}</span>}
              </div>
            </div>

            <div className="flex gap-8 mt-5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Precio</span>
                <p className="text-xl font-semibold">${product?.price}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Costo</span>
                <p className="text-xl font-semibold">${product?.cost}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Existencias</span>
                <p className="text-xl font-semibold">${product?.stock}</p>
                <span className="text-xs font-medium text-muted-foreground">{product?.unit}s</span>
              </div>
            </div>
          </div>


          <div>
            <Skeleton className="w-50 h-50" />
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 border border-input rounded-lg shadow-xs">
        <div className="grid grid-cols-3 gap-5 py-2 border-b border-input font-semibold text-sm">
          <p>Ubicación</p>
          <p>Existencias</p>
          <p>Cantidad Mínima</p>
        </div>
        <div className="grid grid-cols-3 gap-5 py-2 text-foreground/80 text-sm">
          <p>{product?.location ?? '-'}</p>
          <p>{product?.stock}</p>
          <p>{product?.min_stock}</p>
        </div>
      </div>
    </div>
  )
}
