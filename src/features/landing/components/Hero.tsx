import RaysBackground from "./RaysBackground";
import SaasMockup from "./SaasMockup";


export default function Hero() {
  return (
    <section className="relative min-h-[850px] overflow-hidden bg-white">
      <RaysBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur">
            <span className="text-zinc-600">Todo tu negocio</span>
            <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
              En un solo lugar →
            </span>
          </div>
          
          <h1 className="text-5xl font-semibold text-center leading-[1.02] tracking-tight text-black md:text-7xl">
            Controla tu negocio sin complicaciones
          </h1>

          <p className="mt-6 max-w-lg text-lg text-center leading-8 text-zinc-600">
            Gestiona inventario, ventas, productos y reportes desde una
            plataforma diseñada para negocios locales.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-zinc-800">
              Comenzar ahora
            </button>

            <button className="rounded-lg border border-zinc-200 bg-white/80 px-6 py-3 font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:bg-zinc-50">
              Ver demostración
            </button>
          </div>
        </div>
        <div className="mt-20">
          <SaasMockup />
        </div>
      </div>
    </section>
  );
}