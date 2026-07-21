import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function Questions() {
  
  return (
  <section>
    <div className="max-w-6xl px-4 py-20 mx-auto grid grid-cols-2 gap-5">
      <div className="flex flex-col gap-18 min-h-75 p-8 rounded-lg bg-accent">
        <h2 className="text-3xl font-medium">Preguntas frecuentes</h2>
        <div>
          <Button
            asChild
            variant={'secondary'}
          >
            <Link href={'/features'}>Ver funcionalidades</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-rows-3 gap-5">
        <div className="w-full bg-accent border border-input rounded-xl">
        </div>
        <div className="w-full bg-accent border border-input rounded-xl">
        </div>
        <div className="w-full bg-accent border border-input rounded-xl">
        </div>
      </div>
    </div>
  </section>  
  )  
}
