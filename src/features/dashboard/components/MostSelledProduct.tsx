'use client'

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { useBusinessStore } from "@/shared/store/BusinessStore"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpCircle } from "lucide-react";

interface TopProductsProps {
  top_products: {
    ganancia: number;
    id: string;
    name: string;
    sku: string;
    total_vendidos: number;
  }[];
  top_profit_products: {
    id: string;
    name: string;
    total_ganancia: number;
  }
}

export default function MostSelledProduct() {
  const businessId = useBusinessStore(state => state.id);
  const { data, isLoading, error } = useQuery<TopProductsProps>({
    queryKey: ["top-products", businessId],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/top/products', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    enabled: !!businessId,
    retry: 1
  })

  return (
    <div className="col-span-8 p-4 mt-6 xl:mt-0 rounded-lg border border-muted shadow-xs">
      <p className="text-lg font-semibold">Productos más vendidos</p>
      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Vendido</TableHead>
              <TableHead className="text-end">Ganancia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-10 h-2" /></TableCell>
                  <TableCell><Skeleton className="w-42 h-2" /></TableCell>
                  <TableCell><Skeleton className="w-14 h-3" /></TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="w-3 h-3" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              data?.top_products ? (
                data?.top_products.map((product) => (
                <TableRow
                  key={product.id}
                >
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.total_vendidos}</TableCell>
                  <TableCell className="text-end font-semibold text-green-600 dark:text-green-400">
                    <div className="flex justify-end items-center gap-2">
                      <ArrowUpCircle size={15} />
                      $ {product.ganancia.toLocaleString('es-MX', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                  <TableCell 
                  colSpan={4}
                  className="text-center text-muted-foreground"
                  >No hay productos vendidos este mes</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
