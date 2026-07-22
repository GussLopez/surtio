import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowUpRight, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";


export default function LastUpdates() {

  return (
    <section className="max-w-6xl mx-4 xl:mx-auto py-20 border-x border-input/60">
      <div className="px-4 relative">
        <div className="absolute left-0 top-7 block h-6 w-0.5 bg-primary md:top-9" />
        <span className="text-sm tracking-wide uppercase text-muted-foreground">[02] Plataforma</span>
        <div className="flex flex-col gap-10 md:flex-row lg:justify-between lg:items-center">
          <h2 className="text-2xl leading-snug tracking-tight sm:tracking-normal md:text-4xl md:leading-12.5 max-w-[80%] lg:max-w-3xl">
            Una plataforma diseñada para tomar el control de negocios pequeños y medianos que.
          </h2>
          <div className="flex md:flex-col items-center gap-3">
            <Button
              asChild
              variant={'outline'}
              className="w-fit md:w-full"
            >
              <Link href={'/pricing'}>
                <div className="w-4 h-4">
                  <img
                    src="/img/icons/google.svg"
                    alt="Google Icon"
                    className="w-full h-auto"
                  />
                </div>
                Ingresar con Google
              </Link>
            </Button>
            <Button
              asChild
              variant={'secondary'}
              className="w-fit md:w-full group"
            >
              <Link href={'/auth/register'}>
                Crea tu primer producto
                <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 opacity-40 group-hover:opacity-100" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative p-4 mt-5 border-t border-input/60">
        <Skeleton className="w-full min-h-65 h-125 rounded-xl" />
      </div>

      <div className="px-4 mt-10">
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-5">
          <div className="flex flex-col gap-25 p-5 rounded-xl bg-primary-light">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-xl">Supported in 190 countries</h3>
              <div>
                <Globe />
              </div>
            </div>
            <div className="text-muted">
              Talk to a real person when you need help, from onboarding to payout.
            </div>
          </div>
          <div className="flex flex-col gap-25 p-5 rounded-xl bg-[#CBEEF3]"> {/* 00ABF5 */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Real human support</h3>
              <div>
                <MessageCircle />
              </div>
            </div>
            <div className="text-neutral-700">
              Talk to a real person when you need help, from onboarding to payout.
            </div>
          </div>
          <div className="flex flex-col justify-between col-start-3 row-span-2 p-5 rounded-xl bg-muted">
            <h3 className="text-xl">¿Recien comenzando? No hay problema.</h3>
            <p className="text-muted-foreground text-[15px]">Use Ruul to invoice clients and get paid, even without a registered company.</p>
          </div>
          <div className="col-span-2 px-5 pt-5 rounded-xl bg-muted">
            <div className="max-w-1/2 h-full flex flex-col justify-between pb-5 pr-5">
              <h3 className="text-xl">Fast payouts in one business day</h3>
              <p className="text-muted-foreground">Receive a payout in as little as one business day after your client pays.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
