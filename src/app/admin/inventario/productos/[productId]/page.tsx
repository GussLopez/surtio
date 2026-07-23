'use client'

import { Button } from "@/shared/components/ui/button";
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

  const { data, isLoading } = useQuery<Product>({
    queryKey: ["selected-product"],
    queryFn: getProduct,
    enabled: !!productId
  })
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
    </div>
  )
}
