'use client'

import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/utils";
import { CheckCircleIcon, FileArrowUpIcon, FileTextIcon, HardDriveIcon, InvoiceIcon, KeyholeIcon, PackageIcon, TagSimpleIcon, TruckIcon, TruckTrailerIcon } from "@phosphor-icons/react";
import { ArrowRight, Check, TrendingUp, User2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function FeaturesIlustration() {
  const [checkedLoading, setCheckedLoading] = useState(true);
  const [productHover, setProductHover] = useState(false);
  const [rolesHover, setRolesHover] = useState(false);
  const [supplierHover, setSupplierHover] = useState(false);

  const checks = {
    checkVariants: {
      rest: { scale: 1 },
      hover: { scale: 1 }
    },
    checkChildVariants: {
      rest: {
        opacity: .8,
        scale: 1,
        transition: {
          duration: .6,
          delay: 0
        }
      },
      hover: { opacity: 1, scale: 1.1 }
    },
    backgroundVariants: {
      rest: {
        opacity: 0,
        transition: { duration: .3, delay: 0 }
      },
      hover: {
        opacity: .5,
        transition: { duration: .2, delay: .2 }
      }
    }
  }

  const products = [
    {
      img: '/img/landing/products/water.webp',
      name: 'Botella de Agua 500ml',
      stock: 18,
      trend: false
    },
    {
      img: '/img/landing/products/bread.webp',
      name: 'Pan Blanco Paq 600 G',
      stock: 8,
      trend: false
    },
    {
      img: '/img/landing/products/coke.webp',
      name: 'Refresco Coca Cola 250ml',
      stock: 14,
      trend: true
    },
  ];

  const admin = {
    parentVariants: {
      rest: { scale: 1 },
      hover: { scale: 1 }
    },
    adminCard: {
      rest: { width: '90%', scaleY: 1.05 },
      hover: { width: '88%', scaleY: 1 }
    },
    sellerCard: {
      rest: { width: '80%', scaleY: 1 },
      hover: { width: '82%', scaleY: 1.05 }
    }
  }

  const sales = {
    parentVariants: {
      rest: { scale: 1 },
      hover: { scale: 1 }
    },
    backgroundVariants: {
      rest: {
        opacity: 0,
        transition: { duration: .3, delay: 0 }
      },
      hover: {
        opacity: .8,
        transition: { duration: .2, delay: .1 }
      }
    }
  }
  return (
    <div className="grid grid-cols-3 gap-3 px-4 mt-10">
      <motion.div
        className="h-100 p-10 col-span-2 relative rounded-xl border border-input/60 bg-sand group"
        onHoverStart={() => setProductHover(true)}
        onHoverEnd={() => setProductHover(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {productHover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: .3 }}
              exit={{
                opacity: 0,
                transition: { duration: .3 }
              }}
              className="w-[60%] h-7 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 rounded-full blur-3xl bg-primary"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <div className="w-[60%] h-16 flex items-center px-6 rounded-full border relative border-input bg-white group-hover:scale-105 transition-transform duration-300">
            <div className="w-full flex justify-between items-center">
              <p className="text-xl font-medium text-foreground/80">Consulta tu inventario</p>
              <ArrowRight className="size-6 text-muted-foreground" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {productHover && (
              <motion.div
                initial={{ height: 0, opacity: 0, scale: 0 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{
                  height: 0,
                  opacity: 0,
                  scale: 0,
                  transition: {
                    delay: 0
                  }

                }}
                transition={{ duration: .6, type: "spring", delay: .8 }}
                className="w-[60%] overflow-hidden shrink-0 pointer-events-none"
              >
                <div className="pt-5">
                  <div className="h-60 flex px-6 py-1 rounded-xl border border-input bg-white">
                    <ul className="w-full flex flex-col">
                      {products.map((product, i) => (
                        <li
                          key={i}
                          className="w-full flex justify-between items-center py-2 border-b border-input last:border-none"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <Image
                                src={product.img}
                                alt={product.name}
                                width={60}
                                height={60}
                              />
                            </div>
                            <div>
                              <p>{product.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {product.trend && <TrendingUp className="size-4 text-lime-500" />}
                            <p className="text-sm">{product.stock} un.</p>
                          </div>

                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col w-full h-full">
          <h3 className="pt-10 font-medium text-lg mt-auto">Consultas</h3>
        </div>
      </motion.div>

      <motion.div
        className="h-100 p-8 relative rounded-xl border border-input/60 bg-sand"
        variants={checks.checkVariants}
        initial="rest"
        animate="rest"
        whileHover="hover"
        onHoverStart={() => setCheckedLoading(false)}
        onHoverEnd={() => setCheckedLoading(true)}
      >
        <motion.div
          variants={checks.backgroundVariants}
          className="w-20 h-20 absolute top-[30%] right-1/2 translate-x-1/2 rounded-full blur-3xl bg-primary pointer-events-none"
        />
        {[1, 2, 3].map((item, i) => (
          <motion.div
            key={item}
            variants={checks.checkChildVariants}
            transition={{ delay: .1 * i }}
            className={cn("absolute left-[6%] w-[65%] flex items-center gap-5 px-4 py-2 rounded-2xl border border-input pointer-events-none bg-white",
              item === 1
                ? 'mt-10 ml-5'
                : item === 2
                  ? 'mt-23 ml-10'
                  : 'mt-36 ml-15'
            )}
          >
            <div className="relative size-4.5 shrink-0">
              <AnimatePresence mode="sync" initial={false}>
                {checkedLoading ? (
                  <motion.span
                    key={'loading'}
                    initial={{ opacity: 0, scale: .8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: .7 }}
                    transition={{ duration: .2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Spinner className="size-4.5 text-muted-foreground/30" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: .5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: .8,
                      transition: {
                        type: "tween",
                        duration: .2,
                        delay: 0,
                        ease: "easeInOut"
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: .1 * i
                    }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-400"
                  >
                    <Check className="size-3 stroke-3 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="w-full">
              <Skeleton className="w-full h-2 bg-accent-foreground/10" />
              <Skeleton className="w-[80%] h-2 mt-1.5 bg-accent/60" />
            </div>
          </motion.div>
        ))}
        <div className="flex flex-col w-full h-full">
          <h3 className="pt-10 font-medium text-lg mt-auto">Operaciones rápidas</h3>
        </div>
      </motion.div>

      <motion.div
        variants={admin.parentVariants}
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="h-100 p-8 relative rounded-xl border border-input/60 overflow-hidden bg-sand"
        onHoverStart={() => setRolesHover(true)}
        onHoverEnd={() => setRolesHover(false)}
      >
        <div className="w-full absolute top-1/2 -translate-y-1/2 right-0  pointer-events-none">
          <div className="flex flex-col items-end gap-2">
            <div className="w-[80%] flex justify-between items-center p-2 border border-input border-r-0 rounded-l-xl bg-white">
              <div className="flex gap-2">
                <div className="w-8 h-8 flex justify-center items-center border border-input rounded-lg">
                  <User2 className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-10 h-3" />
                </div>
              </div>
              <div>
                <Badge
                  variant='secondary'
                  className="rounded-md text-[10px]"
                >
                  <CheckCircleIcon
                    weight="fill"
                    className="size-1.5 shrink-0 text-black stroke-3"
                  />
                  Gestión
                </Badge>
              </div>
            </div>

            <motion.div
              variants={admin.adminCard}
              className={cn("flex justify-between items-center p-2 border  border-r-0 rounded-l-xl transition-colors bg-white",
                rolesHover ? 'border-input' : 'border-primary/40'
              )}
            >
              <div className="flex gap-2">
                <div className={cn("w-8 h-8 flex justify-center items-center border rounded-lg transition-colors",
                  rolesHover ? 'border-input text-muted-foreground' : 'border-primary/10 bg-primary/10 text-primary'
                )}>
                  <User2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <Skeleton className={cn("w-30 h-3", !rolesHover && 'bg-primary/10')} />
                  <Skeleton className={cn("w-15 h-3", !rolesHover && 'bg-primary/10')} />
                </div>
              </div>
              <div>
                <Badge
                  variant={rolesHover ? 'secondary' : 'outline'}
                  className={cn("rounded-md text-[10px]", !rolesHover && 'text-primary-light')}
                >
                  <KeyholeIcon
                    weight="fill"
                    className="size-1.5 shrink-0 stroke-3"
                  />
                  Admin
                </Badge>
              </div>
            </motion.div>

            <motion.div
              variants={admin.sellerCard}
              className={cn("w-[80%] flex justify-between items-center p-2 border border-r-0 rounded-l-xl bg-white",
                rolesHover ? 'border-primary/40' : 'border-input'
              )}
            >
              <div className="flex gap-2">
                <div className={cn("w-8 h-8 flex justify-center items-center border border-input rounded-lg",
                  rolesHover ? 'border-primary/10 bg-primary/10 text-primary' : 'border-input text-muted-foreground'
                )}>
                  <User2 className="size-5" />
                </div>
                <div className="space-y-1">
                  <Skeleton className={cn("w-30 h-3", rolesHover && 'bg-primary/10')} />
                  <Skeleton className={cn("w-15 h-3", rolesHover && 'bg-primary/10')} />
                </div>
              </div>
              <div>
                <Badge
                  variant={rolesHover ? 'outline' : 'secondary'}
                  className={cn("rounded-md text-[10px]", rolesHover && 'text-primary-light')}
                >
                  <CheckCircleIcon
                    weight="fill"
                    className="size-1.5 shrink-0 stroke-3"
                  />
                  Vendedor
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <h3 className="pt-10 font-medium text-lg mt-auto">Controla el acceso</h3>
        </div>
      </motion.div>
      <motion.div
        className="h-100 p-8 relative rounded-xl border border-input/60 overflow-hidden bg-sand group"
        onHoverStart={() => setSupplierHover(true)}
        onHoverEnd={() => setSupplierHover(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {supplierHover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: .3 }}
              exit={{
                opacity: 0,
                transition: { duration: .3 }
              }}
              className="w-[60%] h-7 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 rounded-full pointer-events-none blur-3xl bg-primary"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 flex justify-center items-center gap-2 pointer-events-none">
          <div className="w-15 h-15 flex justify-center items-center rounded-xl group-hover:scale-105 transition-transform duration-400 border border-muted bg-white">
            <TruckIcon className="size-8 text-primary-light" />
          </div>
          <div className="w-15 h-15 flex justify-center items-center rounded-xl group-hover:scale-105 transition-transform duration-400 border border-muted bg-white">
            <PackageIcon className="size-8 text-primary-light" />
          </div>
          <div className="w-15 h-15 flex justify-center items-center rounded-xl group-hover:scale-105 transition-transform duration-400 border border-muted bg-white">
            <TruckTrailerIcon className="size-8 text-primary-light" />
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <h3 className="pt-10 font-medium text-lg mt-auto">Registra tus proveedores</h3>
        </div>
      </motion.div>

      <motion.div
        variants={sales.parentVariants}
        initial="rest"
        whileHover="hover"
        className="h-100 p-8 relative rounded-xl border border-input/60 overflow-hidden bg-sand group"
      >
        <motion.div
          variants={sales.backgroundVariants}
          transition={{ type: "spring" }}
          className="w-[70%] h-[40%] absolute top-1/2 -translate-y-1/2 right-0 rounded-l-lg pointer-events-none bg-primary blur-3xl"
        />

        <div
          className="w-[80%] absolute top-1/2 -translate-y-1/2 -right-0.5 rounded-l-lg border border-input border-r-0 overflow-hidden pointer-events-none bg-white"
        >
          <div className="flex">
            <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 border-primary-light bg-muted">
              <FileTextIcon weight="bold" className="size-3 text-primary-light" />
              Venta #01
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-r border-muted text-muted-foreground">
              <InvoiceIcon weight="bold" className="size-3" />
              Venta #01
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-r border-muted text-muted-foreground">
              <InvoiceIcon weight="bold" className="size-3" />
              Venta #02
            </div>
          </div>
          <div className="p-5 pt-1 space-y-2">
            <div className="space-y-2">
              <span className="text-neutral-200 dark:text-neutral-800">- - -</span>
              <Skeleton className="w-[30%] h-2 bg-primary-light" />
              <Skeleton className="w-[60%] h-2" />
              <Skeleton className="w-[70%] h-2" />
              <Skeleton className="w-[45%] h-2" />
              <Skeleton className="w-[90%] h-2" />
            </div>
            <div className="space-y-2">
              <span className="text-neutral-200 dark:text-neutral-800">- - -</span>
              <Skeleton className="w-[30%] h-2 bg-primary-light" />
              <Skeleton className="w-[60%] h-2" />
              <Skeleton className="w-[70%] h-2" />
              <Skeleton className="w-[45%] h-2" />
              <Skeleton className="w-[90%] h-2" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <h3 className="pt-10 font-medium text-lg mt-auto">Genrea reportes de ventas</h3>
        </div>
      </motion.div>
      <div className="h-100 col-span-3 bg-muted">
      </div>
    </div>
  )
}
