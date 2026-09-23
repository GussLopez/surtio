import { Button } from "@/shared/components/ui/button";
import RaysBackground from "./RaysBackground";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative min-h-221.5 overflow-hidden">
      <RaysBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-14 lg:px-8">
        <div className="max-w-sm">
          <h1 className="font-medium leading-13 lg:tracking-normal tracking-tight text-5xl">
            Controla tu negocio sin complicaciones
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-6 text-muted-foreground">
            Gestiona inventario, ventas, productos y reportes desde una
            plataforma diseñada para negocios locales.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size={'lg'}
              className="w-full px-3 group cursor-pointer"
              variant={'secondary'}
            >
              Comenzar ahora
              <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 opacity-40 group-hover:opacity-100" />
            </Button>

            <Button
              variant={'outline'}
              size={'lg'}
              className="w-full px-3"
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

        <div className="mt-10 lg:absolute right-[-14%] w-full lg:max-w-4xl overflow-hidden rounded-3xl border border-input bg-white/85 shadow-2xl shadow-primary/15 backdrop-blur-md lg:-mt-10">
          <div>
            <img
              src="/img/landing/dashboard-preview.png"
              alt="Dashboard Preview"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}