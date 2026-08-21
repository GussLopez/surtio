'use client';
import { ArrowLeft, ArrowRight, Banknote, ChevronRight, CreditCard, DollarSign, Ellipsis, ExternalLink, Eye, Search, Trash, Trash2 } from 'lucide-react';
import ComboboxSearchProduct from '@/features/sales/components/SearchProductInput'
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useCartStore } from '@/features/sales/store/useCartStore';
import { type ElementType, useEffect, useState } from 'react';
import { ProductItem } from '@/shared/types';
import { sileo } from 'sileo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NewSaleReceipt from '@/features/sales/components/NewSaleReceipt';
import { useBusinessStore } from '@/shared/store/BusinessStore';
import { cn, normalizeDate } from '@/shared/utils/utils';
import { motion } from 'motion/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { CreditCardIcon } from '@phosphor-icons/react';
import { Spinner } from '@/shared/components/ui/spinner';

interface SelectedPaymentType {
  type: string;
  text: string;
  icon: ElementType;
  color: string;
}
export default function VentasPage() {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const addToCart = useCartStore(state => state.addToCart);
  const businessId = useBusinessStore(state => state.id);
  const getTotal = useCartStore(state => state.getTotal);
  const clearCart = useCartStore(state => state.clearCart);
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const [saleId, setSaleId] = useState<string | null>(null);
  const [paymentM, setPaymentM] = useState<SelectedPaymentType>({
    type: "cash",
    text: "Efectivo",
    icon: Banknote,
    color: ""
  });
  const [saleDate] = useState<Date | undefined>(new Date());
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const precioTotal = getTotal().toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const total = getTotal();
  const received = Number(receivedAmount);
  const hasReceivedAmount = receivedAmount.trim() !== '';
  const change = Number.isFinite(received) ? Math.max(0, received - total) : 0;
  const quickAmounts = Array.from(new Set([
    total,
    Math.ceil(total / 50) * 50,
    Math.ceil(total / 100) * 100,
  ])).slice(0, 3);

  const paymentMethods = [
    {
      type: "credit",
      text: "Tarjeta de Crédito",
      icon: CreditCardIcon,
      color: "bg-green-600/10 text-green-600"
    },
    {
      type: "credit",
      text: "Tarjeta de Débito",
      icon: CreditCard,
      color: "bg-indigo-600/10 text-indigo-600"
    },
    {
      type: "transfet",
      text: "Tranferencia",
      icon: ArrowRight,
      color: "bg-amber-600/10 text-amber-600"
    },
  ]

  useEffect(() => {
    if (!product) {
      return;
    }
    addToCart(product);
    setProduct(null);
  }, [addToCart, product])

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
      clearCart();
      setOpen(true);
      setPaymentM({
        type: "cash",
        text: "Efectivo",
        icon: Banknote,
        color: ""
      })
      setOpenPaymentDialog(false);
      setReceivedAmount('');
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
    <div className='xl:grid xl:grid-cols-2 gap-x-10 gap-y-4 h-[calc(100vh-100px)]'>
      <div>
        <h1 className="text-2xl font-semibold">Buscar productos</h1>
        <div className='mt-5'>
          <ComboboxSearchProduct
            setProduct={setProduct}
          />
        </div>
      </div>

      <div className='flex flex-col mt-5 xl:mt-0 border border-input rounded-xl bg-background'>
        <div className='flex justify-end gap-2 px-6 py-6'>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={clearCart}
          >
            <Trash />
          </Button>
        </div>
        {items.length === 0 ? (
          <div className='flex-1 flex flex-col justify-center items-center p-4'>
            <div className='flex flex-col gap-3 text-center'>
              <h3 className='text-3xl font-black text-muted-foreground/70'>Tu carrito esta vacío</h3>
              <p className='text-muted-foreground/70'>Agrega productos a tu venta</p>
              <Button variant={'outline'} className='shadow-none h-8'>
                <Search />
                Buscar productos
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex flex-col justify-start items-center p-4'>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                className="w-full flex justify-between items-center mt-3 p-3 rounded-lg border border-muted bg-facent shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: -20,
                  overflow: 'hidden'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 50,
                  opacity: { duration: 0.2 }
                }}
              >
                <div className='flex gap-3'>
                  <div className='h-10 w-10 rounded-lg border border-input bg-background'>
                  </div>
                  <div className="w-52 text-sm">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-muted-foreground">$ {item.price}</p>
                  </div>
                  <Input
                    className='w-20 h-9 text-sm'
                    type='number'
                    min={1}
                    max={item.stock}
                    step={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                    aria-label={`Cantidad de ${item.name}`}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-sm'>${(item.price * item.quantity).toFixed(2)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={'ghost'}
                        size={'icon'}
                      >
                        <Ellipsis />
                        <span className='sr-only'>Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Eye />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/inventario/edit/${item.id}`}>
                          <ExternalLink />
                          Editar Producto
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant='destructive'
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 />
                        Eliminar Producto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className='p-6 border-t border-input'>
          <Dialog
            open={openPaymentDialog}
            onOpenChange={(isOpen) => {
              setOpenPaymentDialog(isOpen);
              if (!isOpen) setReceivedAmount('');
            }}
          >
            <DialogTrigger asChild>
              <Button
                className='w-full h-13 font-semibold text-lg bg-primary'
                disabled={items.length === 0 ? true : false}
              >
                Cobrar ${precioTotal}
              </Button>
            </DialogTrigger>
            <DialogContent className='p-0 overflow-hidden bg-facent'>
              <DialogHeader className='border-b border-input p-6 bg-background'>
                <DialogTitle>Registrar venta</DialogTitle>
              </DialogHeader>
              <div className='p-4 pt-0'>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <span className='font-medium text-muted-foreground'>
                    Total a cobrar
                  </span>
                  <p className='text-5xl font-black'>$ {precioTotal}</p>
                </div>
                {paymentM.type === "cash" && (
                  <>
                    <div className='w-full mt-5 p-3 border border-input   rounded-md shadow-xs bg-background'>
                      <div className='flex items-center gap-4'>
                        <div className='w-11 h-11 flex justify-center items-center rounded-md bg-primary/10 text-primary'>
                          <Banknote className='size-6.5' />
                        </div>
                        <p className='text-sm font-medium'>Efectivo</p>
                      </div>
                      <div className='grid grid-cols-2 gap-2.5 mt-3'>
                        <div className='relative'>
                          <Input
                            className='pl-8'
                            placeholder='0.00'
                            type='number'
                            min={0}
                            step='0.01'
                            value={receivedAmount}
                            onChange={(event) => setReceivedAmount(event.target.value)}
                          />
                          <DollarSign className='size-4 absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground' />
                        </div>
                        <div className='flex gap-2 w-full'>
                          {hasReceivedAmount ? (
                            <Button
                              className='w-full bg-primary whitespace-nowrap truncate'
                              onClick={handleCheckOut}
                              disabled={!Number.isFinite(received) || received < total || loading}
                            >
                              {loading ? (
                                <Spinner className='size-5' />
                              ) : (
                                `Cambio $${change.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              )}
                            </Button>
                          ) : (
                            quickAmounts.map((amount) => (
                              <Button
                                key={amount}
                                className='bg-primary'
                                onClick={() => setReceivedAmount(amount.toFixed(2))}
                              >
                                ${amount.toLocaleString('es-MX', { maximumFractionDigits: 2 })}
                              </Button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className='flex flex-col mt-4 rounded-md border border-input shadow-xs roundedl-g bg-background'
                    >
                      {paymentMethods.map((payment, i) => (
                        <div
                          key={i}
                          className='flex py-3 px-4  justify-between items-center border-b border-input hover:bg-muted'
                          onClick={() => setPaymentM(payment)}
                        >
                          <div className='flex items-center gap-4'>
                            <div className={cn(payment.color, 'w-11 h-11 flex justify-center items-center rounded-md')}>
                              <payment.icon className='size-6.5 stroke-[1.5]' />
                            </div>
                            <p className='text-sm font-medium'>{payment.text}</p>
                          </div>

                          <div>
                            <ChevronRight className='size-5 text-muted-foreground stroke-[1.5]' />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {paymentM.type !== "cash" && (
                  <>
                    <button
                      className='flex items-center gap-2 text-primary font-medium text-sm cursor-pointer'
                      onClick={() => setPaymentM({
                        text: "Efectivo",
                        color: "",
                        icon: Banknote,
                        type: "cash"
                      })}
                    >
                      <ArrowLeft />
                      Volver
                    </button>
                    <div className='mt-3 shadow-xs rounded-md overflow-hidden border border-input bg-background'>
                      <div
                        className='flex py-3 px-4 justify-between items-center border-b border-input'
                      >
                        <div className='flex items-center gap-4'>
                          <div className={cn(paymentM.color, 'w-11 h-11 flex justify-center items-center rounded-md')}>
                            <paymentM.icon className='size-6.5 stroke-[1.5]' />
                          </div>
                          <p className='text-sm font-medium'>{paymentM.text}</p>
                        </div>
                      </div>
                      <div className='flex flex-col gap-5 p-5'>
                        <p className='text-sm text-muted-foreground'>Registra una compra con {paymentM.text}</p>
                        <Button
                          className='w-full h-11'
                          onClick={handleCheckOut}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner className='size-6' />
                              Procesando
                            </>
                          ) : `Cobrar ${precioTotal}`}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
