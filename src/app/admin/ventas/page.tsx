'use client'
import { DollarSign, Plus, ScanBarcode, Search, Trash, Trash2 } from 'lucide-react';
import ComboboxSearchProduct from '@/features/sales/components/SearchProductInput'
import { Input } from '@/shared/components/ui/input';
import InputStock from '@/features/sales/components/ProductQuantity';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircleIcon, SealPercentIcon } from '@phosphor-icons/react';
import { useCartStore } from '@/features/sales/store/useCartStore';
import { useEffect, useState } from 'react';
import { ProductItem } from '@/shared/types';
import { sileo } from 'sileo';
import ShoppingCartItems from '@/features/sales/components/ShoppingCart';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@/shared/components/ui/spinner';
import NewSaleReceipt from '@/features/sales/components/NewSaleReceipt';
import { useBusinessStore } from '@/shared/store/BusinessStore';
import { normalizeDate } from '@/shared/utils/utils';
import { motion } from 'motion/react';

export default function VentasPage() {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const businessId = useBusinessStore(state => state.id);
  const getTotal = useCartStore(state => state.getTotal);
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart)
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
      const items = useCartStore.getState().items;

      if (items.length === 0) {
        throw new Error("El carrito esta vacío");
      }

      const formattedItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));
      const res = await fetch('/api/sales/create', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod: "cash",
          items: formattedItems,
          businessId,
          saleDate: normalizeDate(saleDate || new Date())
        })
      })
      if (!res.ok) {
        const err = await res.json();
        console.error("ERROR BACKEND:", err);
        throw new Error(err.error || 'Error fetching');
      }
      setSaleId(await res.json());
      useCartStore.getState().clearCart();
      setOpen(true);
      sileo.success({
        title: "Venta registrada",
        description: "La venta se registró correctamente",
        autopilot: true
      });
      queryClient.invalidateQueries({ queryKey: ["stock-products", "sales-reports"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyRevenue", businessId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardKpis", businessId] });
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
    queryFn: async () => {
      if (!saleId) throw new Error("No saleId");
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'GET'
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: !!saleId
  })
  return (
    <div className='xl:grid xl:grid-cols-2 gap-x-10 gap-y-4 h-[calc(100vh-70px)]'>
      <div>
        <h1 className="text-3xl font-semibold">Buscar productos</h1>
        <div className='mt-5'>
          <ComboboxSearchProduct
            setProduct={setProduct}
            btnClass='w-full  justify-between'
          />
        </div>

      </div>

      <div className='flex flex-col mt-5 xl:mt-0 border-l border-input'>
        <div className='flex justify-end gap-2'>
          <Button
            variant={'outline'}
            size={'icon'}
          >
            <Trash />
          </Button>
          <Button
            variant={'outline'}
            size={'icon'}
          >
            <Trash />
          </Button>
        </div>
        <div className='flex-1 flex justify-center items-center p-4'>
          {items.length === 0 ? (
            <div className='flex flex-col gap-3 text-center'>
              <h3 className='text-3xl font-black text-muted-foreground/70'>Tu carrito esta vacío</h3>
              <p className='text-muted-foreground/70'>Agrega productos a tu venta</p>
              <Button variant={'outline'} className='shadow-none h-8'>
                <Search />
                Buscar productos
              </Button>
            </div>
          ) : (
            items.map(item => (
              <motion.div
                key={item.id}
                layout
                className="flex justify-between items-center mt-3 p-3 rounded-lg border border-muted bg-background"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: -20,
                  height: 0,
                  marginTop: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  overflow: 'hidden'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 50,
                  opacity: { duration: 0.2 }
                }}
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs">{item.quantity} x ${item.price}</p>
                </div>
                <div>
                  <Button
                    size={'icon-sm'}
                    variant={'ghost'}
                    className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </motion.div>
            ))
          )}

        </div>
        <div className='p-6 border-t border-input'>
          <Button
            className='w-full h-13 text-lg bg-primary-light'
            disabled
          >
            Cobrar $0.0
          </Button>
        </div>
      </div>
      {/*  <ShoppingCartItems date={saleDate} setDate={setSaleDate} /> */}
      {receipt && (
        <NewSaleReceipt
          sale={receipt}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  )
}


