'use client'
import { useState } from 'react';

import { ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'

import { useQuery } from '@tanstack/react-query'
import { ProductItem } from '@/shared/types'
import { useDebounce } from 'use-debounce';
import { useBusinessStore } from '@/shared/store/BusinessStore';

interface SearchProductProps {
  setProduct: (product: ProductItem) => void;
  btnSize?: 'xs' | 'sm' | 'lg' | 'default';
  btnClass?: string;
  placeholder?: string;
}

const SearchProductInput = ({
  setProduct,
  btnClass = 'w-full justify-between',
  btnSize = 'default',
  placeholder = 'Buscar por nombre o SKU...',
}: SearchProductProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch] = useDebounce(inputValue, 400);
  const businessId = useBusinessStore(state => state.id);

  const { data: products = null, isLoading } = useQuery<ProductItem[]>({
    queryKey: ['products-search', debouncedSearch, businessId],
    queryFn: async () => {
      const res = await fetch('/api/products/search', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          search: debouncedSearch,
        }),
      })
      if (!res.ok) throw new Error('Error fetching')

      return res.json()
    },
    enabled: !!businessId && open,
    staleTime: 1000 * 60 * 5,
  })

  const handleSelect = (product: ProductItem) => {
    setProduct({
      ...product,
      quantity: 1,
    })
    setOpen(false)
    setInputValue('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size={btnSize}
          role='combobox'
          aria-expanded={open}
          className={btnClass}
          aria-label='Buscar producto'
        >
          {placeholder}
          <ChevronsUpDownIcon className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0 w-110'>
        {/* shouldFilter={false} porque el filtrado se hace en el servidor */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            className='h-9'
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading && (
              <CommandEmpty>Buscando...</CommandEmpty>
            )}
            {!isLoading && (products === null || products.length === 0) && (
              <CommandEmpty>
                {inputValue.trim().length === 0
                  ? 'Escribe para buscar un producto...'
                  : 'Producto no encontrado.'}
              </CommandEmpty>
            )}
            <CommandGroup>
              {products?.map(product => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={() => handleSelect(product)}
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
                    <div className='px-2 py-1 rounded-full bg-green-100 text-green-700'>
                      <span className='text-xs font-medium'>{product.stock} {product.unit}s</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchProductInput
