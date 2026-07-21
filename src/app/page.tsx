import Header from "@/shared/components/ui/header";
import Hero from "../features/landing/components/Hero";
import StepOne from "@/features/landing/components/StepOne";
import Footer from "@/shared/components/ui/footer";
import { Metadata } from "next";
import { GeneratePageTitle } from "@/shared/utils/metadata";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: GeneratePageTitle('La plataforma para hacer crecer tu negocio')
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="border-y border-input/60">
          <StepOne />
        </div>

        <div className="">
          <div className="max-w-6xl px-4 py-6 mx-4 xl:mx-auto border-x border-input/60">
            <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
              <p className="text-[28px] font-medium">La plataforma pensada para negocios locales</p>
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant={'outline'}
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
                  className="group"
                >
                  <Link href={'/auth/register'}>
                    Comenzar ahora
                    <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 opacity-40 group-hover:opacity-100" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>

  );
}
