'use client'
import { useState } from 'react';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

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

import { cn } from '@/shared/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ProductItem } from '@/shared/types'
import { useDebounce } from 'use-debounce';
import { useBusinessStore } from '@/shared/store/BusinessStore';

interface SearchProductProps {
  setProduct: (product: ProductItem) => void;
  btnSize?: 'xs' | 'sm' | 'lg' | 'default';
  btnClass: string;
  placeholder?: string;
}
const SearchProductInput = ({ setProduct, btnClass, btnSize = 'default', placeholder }: SearchProductProps) => {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size={btnSize}
          role='combobox'
          aria-expanded={open}
          className={btnClass}
          aria-label='Framework combobox'
        >
          {selectedProduct
            ? (`${selectedProduct.name} (${selectedProduct.sku}) - ${selectedProduct.model}`)
            : placeholder ? placeholder : 'Buscar por nombre o SKU...'}
          <ChevronsUpDownIcon className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Buscar por nombre o SKU...'
            className='h-9'
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading && (
              <CommandEmpty>Buscando...</CommandEmpty>
            )}
            {!isLoading && products === null && (
              <CommandEmpty >Escribe al menos 1 caracter para buscar...</CommandEmpty>
            )}
            {!isLoading && products?.length === 0 && (
              <CommandEmpty>Producto no encontrado.</CommandEmpty>
            )}
            <CommandGroup>
              {products?.map(product => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={currentValue => {
                    setProduct({
                      ...product,
                      quantity: 1
                    })
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setInputValue('')
                  }}
                >
                  {product.name} ({product.sku}) - {product.model && product.model}
                  <CheckIcon
                    className={cn('ml-auto',
                      value === product.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
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
