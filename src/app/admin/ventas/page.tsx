'use client'
import { DollarSign, Plus, ScanBarcode } from 'lucide-react';
import ComboboxSearchProduct from '@/components/sales/SearchProductInput'
import { Input } from '@/components/ui/input';
import InputStock from '@/components/sales/ProductQuantity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, SealPercentIcon } from '@phosphor-icons/react';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { ProductItem } from '@/types';
import { sileo } from 'sileo';
import ShoppingCartItems from '@/components/sales/ShoppingCart';
import { createSaleFromCart, getSaleById } from '@/lib/services/salesService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import NewSaleReceipt from '@/components/sales/NewSaleReceipt';
import { useBusinessStore } from '@/store/BusinessStore';

export default function VentasPage() {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const businessId = useBusinessStore(state => state.id);
  const getTotal = useCartStore(state => state.getTotal);
  const items = useCartStore(state => state.items);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [saleDate, setSaleDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const precioTotal = getTotal().toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleAddProduct = () => {
    if (!product) {
      sileo.warning({
        title: 'Selecciona un producto',
        description: 'Seleeciona un producto para añadirlo al carrito y registrar la compra',
        autopilot: false
      })
      return;
    }
    addToCart(product);
    setProduct(null);
  }

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const newSaleId = await createSaleFromCart("cash", businessId!, saleDate || new Date());
      setSaleId(newSaleId);
      setOpen(true);
      sileo.success({
        title: "Venta registrada",
        description: "La venta se registró correctamente",
        autopilot: true
      });
      queryClient.invalidateQueries({ queryKey: ["stock-products", "sales-reports"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyRevenue", businessId] });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      sileo.error({
        title: "Error al registrar venta",
        description: 'Ocurrió un error al registrar la venta, intente más tarde',
        autopilot: false
      });
    }
  }

  const { data: receipt } = useQuery({
    queryKey: ["sale-recipe", saleId],
    queryFn: () => {
      if (!saleId) throw new Error("No saleId");
      return getSaleById(saleId);
    },
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: !!saleId
  })
  return (
    <div>
      <div className="flex items-center gap-3">
        <SealPercentIcon size={30} className='text-green-600' />
        <h1 className="text-3xl font-semibold">Ventas</h1>
      </div>

      <div className='grid grid-cols-3 gap-x-10 gap-y-4 mt-10'>
        <div className='col-span-2 p-4 rounded-lg border border-input'>
          <div className='flex items-center gap-3'>
            <ScanBarcode />
            <h2 className='font-semibold text-lg'>Agregar Items</h2>
          </div>
          <div className='flex gap-5 mt-4 text-xs font-medium text-muted-foreground'>
            <div className='w-full max-w-80'>
              <label htmlFor='searhProduct'>Buscar producto</label>
              <ComboboxSearchProduct
                setProduct={setProduct}
                btnClass='w-full max-w-xs justify-between'
              />
            </div>
            <div className='w-full max-w-60'>
              <label>Precio de venta</label>
              <div className='relative'>
                <Input
                  className='pl-9'
                  type='number'
                  value={product?.price || 0}
                  disabled={!product}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setProduct(prev => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        price: value
                      }
                    })
                  }}
                />
                <DollarSign className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              </div>
            </div>

            <div className='col-span-2'>
              <label>Cant.</label>
              <InputStock
                quantity={product?.quantity ?? 1}
                stock={product?.stock ?? 0}
                setProduct={setProduct}
                disabled={!product}
              />
            </div>
          </div>
          <Button
            className='w-full mt-5 bg-primary-light'
            onClick={handleAddProduct}
          >
            <Plus />
            Agregar Item
          </Button>
        </div>

        <div className='border border-input rounded-lg'>
          <div className='flex items-center justify-between p-4 border-b border-input'>
            <h2 className='text-3xl font-semibold'>Total a pagar</h2>
            <Badge variant={'outline'} className='border-emerald-500 text-emerald-500'>MXN</Badge>
          </div>
          <div className='py-4 text-center'>
            <p className='text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-cyan-600'>{precioTotal} MXN</p>
          </div>

          <div className='p-4'>
            <Button
              className="w-full h-12 text-xl font-black gap-2 transition-all bg-[#29c24a] hover:bg-[#00ac33] text-white active:scale-[0.98]"
              disabled={items.length <= 0 || loading}
              onClick={handleCheckOut}
            >
              {loading ? (
                <>
                  <Spinner />
                  Pagando
                </>
              ) : (
                <>
                  <CheckCircleIcon weight="bold" className='size-8' />
                  PAGAR AHORA
                </>
              )}
            </Button>
          </div>
        </div>
        <ShoppingCartItems date={saleDate} setDate={setSaleDate} />
      </div>
      {receipt && (
        <NewSaleReceipt
          sale={receipt}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div >
  )
}


