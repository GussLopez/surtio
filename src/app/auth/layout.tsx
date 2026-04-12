import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      {children}
      <div className="hidden lg:block w-full p-5">
        <div className="w-full h-full flex flex-col gap-10 px-20 justify-center rounded-2xl bg-primary/85 relative">
          <div className="">
            <h2 className="max-w-120 text-3xl font-medium text-white">Gestiona tu tienda y tus ventas sin esfuerzo.</h2>
            <p className="max-w-130 mt-5 text-sm text-white/90">Inicia sesión para acceder al dashboard de tu gestor de inventario y controla tu negocio.</p>
          </div>
          <div className="relative w-full">
            <Skeleton className="w-120 h-90 flex justify-center items-center  bottom-28 left-20 rounded-xl text-muted-foreground bg-muted">
              <Image size={30} />
            </Skeleton>
            <Skeleton className="w-45 h-45 absolute right-8 top-8 rounded-xl "></Skeleton>
          </div>
        </div>
      </div>
      
    </div>
  );
}
