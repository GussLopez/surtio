import Header from "@/shared/components/ui/header";
import Hero from "../features/landing/components/Hero";
import StepOne from "@/features/landing/components/StepOne";
import Footer from "@/shared/components/ui/footer";
import { Metadata } from "next";
import { GeneratePageTitle } from "@/shared/utils/metadata";

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
      </main>
      <Footer />
    </>

  );
}
