import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function StepOne() {

  return (
    <section className="max-w-6xl mx-auto py-40 px-4">
      <span className="text-sm tracking-wide uppercase text-muted-foreground">[01] Como funciona</span>
      <div>
        <h2 className="font-heading text-2xl  leading-snug tracking-tight sm:tracking-normal md:text-4xl md:leading-12.5 max-w-[80%] lg:max-w-3xl">
          Crea tu tienda, crea tus productos y comienza a tomar el control de tu negocio.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-20">
          <div>
            <div>
              <div className="flex gap-5 text-lg">
                <span>01</span>
                <span>Configura tu tienda</span>
              </div>
              <p className="max-w-sm mt-5 text-[15px] text-muted-foreground">
                Añade tus productos masivamente, agrupalos por categorías, marcas y más
              </p>
            </div>
            <div className="w-full max-w-xl flex items-center gap-3 mt-10">
              <Button className="min-w-0 flex-1 bg-black hover:bg-black/80">
                Ver más
                <ChevronRight className="" />
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
            <Skeleton className="w-131.25 h-110" />
          </div>
        </div>
      </div>
    </section>
  )
}
