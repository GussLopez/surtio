'use client'
import { Sale } from "@/types"
import { Badge } from "../ui/badge"
import { BriefcaseIcon, CalendarBlankIcon, NotePencilIcon, PackageIcon, ReceiptIcon, TrendUpIcon, UserCircleIcon } from "@phosphor-icons/react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Ban, Trash2 } from "lucide-react"

interface SaleListProps {
  data: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
  onNull: (saleId: string) => void;
}

export default function SalesListView({ data, onView, onEdit, onDelete, onNull }: SaleListProps) {

  return (
    <div className="space-y-4">
      {data?.map((sale) => {
        const formateDate = new Date(sale.created_at!)
          .toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        const totalCost = sale.sale_items.reduce((total, item) => {
          return total + (item.products.cost * item.quantity)
        }, 0)

        const totalRevenue = sale.sale_items.reduce((total, item) => {
          return total + ((item.price - item.products.cost) * item.quantity)
        }, 0)
        return (
          <div
            key={sale.id}
            className="w-full flex flex-col xl:flex-row border rounded-xl border-input overflow-hidden"
          >
            <div className="xl:w-1/4 grid grid-cols-2 gap-2 lg:grid-cols-4 xl:block p-2 xl:p-5 shrink-0 border-b xl:border-r xl:border-b-0 border-input bg-background ">
              <Badge
                variant={'secondary'}
                className="text-xs font-mono rounded-xs"
              >
                {sale.sale_number}
              </Badge>
              <div className="flex items-center text-sm gap-4 font-medium xl:mt-4">
                <CalendarBlankIcon size={23} className="text-muted-foreground" />
                <p>{formateDate}</p>
              </div>
              <div className="flex items-center text-sm gap-4 font-medium mt-2 text-green-600 dark:text-green-400">
                <UserCircleIcon size={23} />
                <div className="flex flex-col">
                  <p>Cliente Anónimo</p>
                  <span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground">Cleinte</span>
                </div>
              </div>
              <Separator className="w-full h-px my-3 bg-muted hidden xl:block" />
              <div className="flex items-center gap-4">
                <BriefcaseIcon size={23} className="text-blue-400" weight="duotone" />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{sale.seller_name}</p>
                  <span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground">Vendedor</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center gap-3 p-2.5 border-b border-input text-muted-foreground">
                <PackageIcon size={20} />
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                >Productos ({sale.sale_items.length})</p>
              </div>
              <div className="h-full bg-facent p-2">
                {sale.sale_items.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 p-2 rounded-md border border-transparent hover:border-input transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div>
                        <span className="flex items-center justify-center w-10 h-10 rounded-sm bg-background border border-input">{i + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.products.name}</p>
                        <span className="text-xs tracking-wider font-mono">{item.products.sku}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p
                        className="text-sm font-bold text-accent-foreground"
                      >{(item.price * item.quantity).toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} MXN
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x {item.price.toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} MXN
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:w-1/4 shrink-0 p-5 border-t xl:border-t-0 xl:border-l border-input">
              <div className="flex gap-2 justify-between items-baseline">
                <span
                  className="font-bold  text-sm uppercase tracking-widest text-muted-foreground"
                >Total</span>
                <span className="text-2xl font-bold">
                  {sale.total.toLocaleString('es-MX', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
              <Separator className="w-full h-px my-2" />
              <div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Costo: </span>
                  <span className="font-mono">{totalCost.toLocaleString('ex-MX', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })} MXN</span>

                </div>
                <div className="flex justify-between mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                  <div className="flex items-center gap-2">
                    <TrendUpIcon size={20} weight="bold" />
                    <p>Ganancia</p>
                  </div>
                  <span className="font-mono">{totalRevenue.toLocaleString('ex-MX', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })} MXN</span>

                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant={"outline"}
                  onClick={() => onView(sale)}>
                  <ReceiptIcon size={20} />
                  Recibo
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => onEdit(sale)}
                >
                  <NotePencilIcon size={20} />
                  Editar
                </Button>
                <Button
                  variant={"ghost"}
                  className="col-span-2 bg-amber-400 hover:bg-amber-500/80 dark:text-black dark:hover:bg-amber-400/90"
                  onClick={() => onNull(sale.id)}
                >
                  <Ban size={20} />
                  Cancelar venta
                </Button>

                <Button
                  variant={'ghost'}
                  className="bg-red-500 hover:bg-red-600 hover:text-white text-white dark:hover:bg-red-600/90 col-span-2 xl:col-span-1"
                  onClick={() => onDelete(sale.id)}
                >
                  <Trash2 />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
