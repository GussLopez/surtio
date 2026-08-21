'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/components/ui/combobox';
import { Spinner } from '@/shared/components/ui/spinner';
import { useBusinessStore } from '@/shared/store/BusinessStore';
import type { ProductItem } from '@/shared/types';

interface SearchProductInputProps {
  setProduct: (product: ProductItem) => void;
}

const SEARCH_DELAY = 350;

async function searchProducts(businessId: string, search: string) {
  const response = await fetch('/api/products/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId, search }),
  });

  if (!response.ok) {
    throw new Error('No fue posible cargar los productos');
  }

  return response.json() as Promise<ProductItem[]>;
}

export default function SearchProductInput({ setProduct }: SearchProductInputProps) {
  const businessId = useBusinessStore((state) => state.id);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search.trim(), SEARCH_DELAY);

  const { data: products = [], isFetching, isError } = useQuery({
    queryKey: ['products-search', businessId, debouncedSearch],
    queryFn: () => searchProducts(businessId!, debouncedSearch),
    enabled: open && !!businessId,
    staleTime: 60_000,
  });

  const handleSelect = (product: ProductItem | null) => {
    if (!product) return;

    setProduct({ ...product, quantity: 1 });
    setSearch('');
    setOpen(false);
  };

  return (
    <Combobox
      items={products}
      inputValue={search}
      onInputValueChange={setSearch}
      itemToStringLabel={(product: ProductItem) => `${product.name} - (${product.sku})`}
      value={null}
      onValueChange={handleSelect}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxInput
        className="bg-background"
        placeholder="Buscar por nombre o SKU"
        showClear={search.length > 0}
      />
      <ComboboxContent>
        {isFetching && products.length === 0 ? (
          <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            Cargando productos...
          </div>
        ) : (
          <>
            <ComboboxEmpty>
              {isError ? 'No fue posible cargar los productos.' : 'No se encontraron productos.'}
            </ComboboxEmpty>
            <ComboboxList>
              {(product: ProductItem) => (
                <ComboboxItem key={product.id} value={product}>
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium text-neutral-700 dark:text-neutral-200">
                        {product.name} - ({product.sku})
                      </p>
                      <span className="text-muted-foreground">
                        ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="shrink-0 rounded-full bg-green-100 px-2 text-green-700">
                      <span className="text-xs font-medium">
                        {product.stock} {product.unit ?? 'unidad'}(s)
                      </span>
                    </div>
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
