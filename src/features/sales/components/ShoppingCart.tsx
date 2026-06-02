'use client';
import { useCartStore } from "@/features/sales/store/useCartStore";
import { CalendarIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface ShoppingCartProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function ShoppingCartItems({ date, setDate } : ShoppingCartProps) {
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart)
  return (
    <div className="col-span-2 mt-5 xl:mt-0 p-4 border border-input rounded-lg">
      <div className="flex items-center gap-3">
        <ShoppingCartIcon size={24} />
        <h2 className="font-semibold text-lg">Carrito de compras</h2>
      </div>
      <div>
        <div className="flex gap-5 items-center p-3 mt-4 rounded-md bg-facent">
          <p className="font-medium">Fecha de venta</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <CalendarIcon />
                {date ? format(date, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key={'empty-cart'}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='flex flex-col items-center mt-3 py-12 border-2 border-dashed border-input rounded-lg text-muted-foreground'
            >
              <ShoppingCartIcon size={40} />
              <p className="font-medium">El carrito está vacío</p>
              <p className="text-xs ">Agrega productos para comenzar una venta</p>
            </motion.div>
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
        </AnimatePresence>
      </div>
    </div >
  )
}
