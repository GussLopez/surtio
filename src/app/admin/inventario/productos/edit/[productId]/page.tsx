'use client'

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Product } from "@/shared/types";
import { cn } from "@/shared/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProductPage() {
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Button
            variant={'outline'}
            size={'icon'}

          >
            <Link href={'/admin/inventario'}>
              <ArrowLeft className="size-5" />
              <span className="sr-only">Volver atras</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">{product?.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-10">
        <div className="border border-input rounded-lg shadow-xs">
          <h2 className="font-medium p-6">Datos del producto</h2>

          <div className="grid grid-cols-2 gap-5 px-6 pb-6">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="productName">Nombre del producto *</Label>
              <Input id="productName" />
            </div>
            <div>
              <span className="text-sm font-medium">Tipo</span>
              <div className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
                <Button
                  variant={'outline'}
                  className={cn(product?.type === 'product' && 'border-primary-light',
                    "shadow-none border-[1.8px]"
                  )}

                >
                  Producto
                </Button>
                <Button
                  variant={'outline'}
                  className={cn(product?.type === 'service' && 'border-primary-light',
                    "shadow-none border-[1.8px]"
                  )}

                >
                  Servicio
                </Button>
              </div>
            </div>

            
          </div>
        </div>

        <div className="border border-input rounded-lg shadow-xs">

        </div>
      </div>
    </div>
  )
}
