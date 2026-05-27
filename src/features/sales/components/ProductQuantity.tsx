'use client'

import { ProductItem } from '@/types';
import { MinusIcon, PlusIcon } from 'lucide-react'

import { Button, Group, Input, NumberField } from 'react-aria-components';

interface InputStockProps {
  quantity: number;
  disabled: boolean;
  stock: number;
  setProduct: React.Dispatch<React.SetStateAction<ProductItem | null>>;
}

const InputStock = ({ quantity, stock, setProduct, disabled }: InputStockProps) => {
  return (
    <NumberField
      aria-label="Cantidad del producto"
      value={quantity}
      minValue={1}
      maxValue={stock}
      isDisabled={disabled}
      onChange={(value) =>
        setProduct((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            quantity: value
          }
        })}
      className='w-full max-w-xs space-y-2'
    >
      <Group className='dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm'>
        <Input
          className='selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none'
        />
        <Button
          slot='decrement'
          className='border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          <MinusIcon />
          <span className='sr-only'>Decrement</span>
        </Button>
        <Button
          slot='increment'
          className='border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          <PlusIcon />
          <span className='sr-only'>Increment</span>
        </Button>
      </Group>
    </NumberField>
  )
}

export default InputStock
