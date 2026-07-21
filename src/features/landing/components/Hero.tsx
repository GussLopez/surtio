import { Button } from "@/shared/components/ui/button";
import RaysBackground from "./RaysBackground";
import SaasMockup from "./SaasMockup";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative min-h-221.5 overflow-hidden">
      <RaysBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur">
            <span className="text-zinc-600">Todo tu negocio</span>
            <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
              En un solo lugar →
            </span>
          </div>

          <h1 className="font-medium leading-snug lg:leading-18 lg:tracking-normal tracking-tight text-5xl 2xl:text-7xl">
            Controla tu negocio sin complicaciones
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-6 text-muted-foreground">
            Gestiona inventario, ventas, productos y reportes desde una
            plataforma diseñada para negocios locales.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size={'lg'}
              className="px-3 group"
              variant={'secondary'}
            >
              Comenzar ahora
              <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 opacity-40 group-hover:opacity-100" />
            </Button>

            <Button
              variant={'outline'}
              size={'lg'}
              className="px-3"
              asChild
            >
              <Link href={'/auth/login'}>
                <div className="w-4 h-4">
                  <img
                    src="/img/icons/google.svg"
                    alt="Google Icon"
                    className="w-full h-auto"
                  />
                </div>
                Regístrate con Google
              </Link>
            </Button>
          </div>
        </div>

        <SaasMockup />
      </div>
    </section >
  );
}