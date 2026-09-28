'use client'

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/utils";
import { ArrowRight, Check, Search, TrendingUp } from "lucide-react";
import { AnimatePresence, delay, motion, scale } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function FeaturesIlustration() {
  const [checkedLoading, setCheckedLoading] = useState(true);
  const [productSearch, setProductSearch] = useState(false);

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
  ]
  return (
    <div className="grid grid-cols-3 gap-3 px-4 mt-10">
      <motion.div
        className="h-100 p-10 col-span-2 relative rounded-xl border border-input/60 bg-sand group"
        onHoverStart={() => setProductSearch(true)}
        onHoverEnd={() => setProductSearch(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {productSearch && (
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
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="w-[60%] h-16 flex items-center px-6 rounded-full border relative border-input bg-white group-hover:scale-105 transition-transform duration-300">
            <div className="w-full flex justify-between items-center">
              <p className="text-xl font-medium text-foreground/80">Consulta tu inventario</p>
              <ArrowRight className="size-6 text-muted-foreground" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {productSearch && (
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
                className="w-[60%] overflow-hidden shrink-0"
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
          className="w-20 h-20 absolute top-[30%] right-1/2 translate-x-1/2 rounded-full blur-3xl bg-primary"
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
      <div className="h-100 bg-muted">
      </div>
      <div className="h-100 bg-muted">
      </div>
      <div className="h-100 bg-muted">
      </div>
      <div className="h-100 col-span-3 bg-muted">
      </div>
    </div>
  )
}
