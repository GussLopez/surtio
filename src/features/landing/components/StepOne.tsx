import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function StepOne() {

  return (
    <section className="max-w-6xl mx-4 xl:mx-auto py-30 border-x border-input/60 relative">
      <div className="px-4 relative">
        <div className="absolute left-0 top-12 block h-6 w-0.5 bg-primary lg:top-9" />
        <span className="text-sm tracking-wide uppercase text-muted-foreground">[01] Como funciona</span>
        <h2 className="text-2xl leading-snug tracking-tight sm:tracking-normal md:text-4xl md:leading-12.5 max-w-[80%] lg:max-w-3xl">
          Crea tu tienda, crea tus productos y comienza a tomar el control de tu negocio.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-20 py-16 px-4">
        <div>
          <div>
            <div className="flex gap-5 text-xl">
              <span>01</span>
              <span>Configura tu tienda</span>
            </div>
            <p className="max-w-sm mt-5 text-[15px] text-muted-foreground">
              Empieza creando una cuenta para obtener tu tienda y configurala a tu manera
            </p>
          </div>
          <div className="w-full max-w-xl flex items-center gap-3 mt-10">
            <Button
              className="min-w-0 flex-1"
              variant={'secondary'}
            >
              Ver más
              <ChevronRight />
            </Button>
            <Button
              variant={'outline'}
              className="min-w-0 flex-1"
            >
              <div className="w-4 h-4">
                <img
                  src="/img/icons/google.svg"
                  alt="Google Icon"
                />
              </div>
              Ingresar con Google
            </Button>
          </div>
        </div>
        <div>
          <Skeleton className="w-full max-w-131.25 min-h-110" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-20 py-16 px-4 border-t border-input/60">
        <div>
          <div>
            <div className="flex gap-5 text-xl">
              <span>02</span>
              <span>Añade tus productos</span>
            </div>
            <p className="max-w-sm mt-5 text-[15px] text-muted-foreground">
              Añade tus productos masivamente, registra su stock, agrupalos por categorías o
            </p>
          </div>
          <div className="w-full max-w-xl flex items-center gap-3 mt-10">
            <Button
              variant={'secondary'}
              className="min-w-0 flex-1"
            >

              Ver más
              <ChevronRight />
            </Button>
            <Button
              variant={'outline'}
              className="min-w-0 flex-1"
            >
              <div className="w-4 h-4">
                <img
                  src="/img/icons/google.svg"
                  alt="Google Icon"
                />
              </div>
              Ingresar con Google
            </Button>
          </div>
        </div>
        <div>
          <Skeleton className="w-full max-w-131.25 min-h-110" />
        </div>
      </div>
    </section>
  )
}
