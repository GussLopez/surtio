'use client';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query'
import { Product, ProductItem } from '@/shared/types'
import { useDebounce } from 'use-debounce';
import { useBusinessStore } from '@/shared/store/BusinessStore';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/shared/components/ui/combobox';

interface SearchProductProps {
  setProduct: (product: ProductItem) => void;
}
const SearchProductInput = ({ setProduct }: SearchProductProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch] = useDebounce(inputValue, 500);
  const businessId = useBusinessStore(state => state.id);

  const { data: products = null, isLoading } = useQuery<ProductItem[]>({
    queryKey: ['products-search', debouncedSearch, businessId],
    queryFn: async () => {
      const res = await fetch('/api/products/search', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          search: debouncedSearch
        })
      })
      if (!res.ok) throw new Error("Error fetching")

      return res.json()
    },
    enabled: debouncedSearch.trim().length > 0 || !!businessId,
    staleTime: 1000 * 60 * 50
  })
  const selectedProduct = products?.find(p => p.id === value)

  return (
    <Combobox items={products || []}>
      <ComboboxInput
        value={value}
        placeholder="Selecciona un producto"
        className="bg-background"
      />
      <ComboboxContent>
        <ComboboxEmpty>No se encontraron productos.</ComboboxEmpty>
        <ComboboxList>
          {(product: Product) => (
            <ComboboxItem
              key={product.id}
              value={product}
              onClick={() => {
                setProduct({
                  ...product,
                  quantity: 1
                })
                setOpen(false)
                setInputValue('')
              }}
            >
              <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 border border-input rounded-lg'></div>
                  <div className='text-sm'>
                    <p className='font-medium text-neutral-700 dark:text-neutral-200'>
                      {product.name} - ({product.sku})
                    </p>
                    <span className='text-muted-foreground'>$ {product.price}</span>
                  </div>
                </div>
                <div className='px-2 rounded-full bg-green-100 text-green-700'>
                  <span className='text-xs font-medium'>{product.stock} {product.unit}s</span>
                </div>
              </div>

            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox >
  )
}

export default SearchProductInput
