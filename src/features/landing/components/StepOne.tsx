import { Skeleton } from "@/shared/components/ui/skeleton";

export default function StepOne() {

  return (
    <section className="max-w-7xl mx-auto mt-20 px-4 pb-40">
      <span className="text-sm tracking-wide uppercase text-muted-foreground">[01] Como funciona</span>
      <div>
        <h2 className="font-heading text-2xl  leading-snug tracking-tight sm:tracking-normal md:text-4xl md:leading-12.5 max-w-[80%] lg:max-w-3xl">
          Crea tu tienda, crea tus productos y comienza a tomar el control de tu negocio.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-20">
          <div>
            <div className="flex gap-5 text-lg">
              <span>01</span>
              <span>Configura tu tienda</span>
            </div>
            <p className="max-w-sm mt-5 text-[15px] text-muted-foreground">
              Añade tus productos masivamente, agrupalos por categorías, marcas y más
            </p>
          </div>
          <div>
            <Skeleton className="w-131.25 h-110" />
          </div>
        </div>
      </div>
    </section>
  )
}
