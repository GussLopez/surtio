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
        <div className="w-full h-full flex flex-col gap-10 px-20 justify-center rounded-2xl bg-primary/85 relative overflow-hidden">
          {/* Dashed Bottom Fade Grid */}
          <div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 0",
              maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
              WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          />

          <div className="z-10">
            <h2 className="max-w-120 text-4xl font-medium text-white">Gestiona tu tienda y tus ventas sin esfuerzo.</h2>
            <p className="max-w-120 mt-3 text-sm text-white/80">Inicia sesión para acceder al dashboard de tu gestor de inventario y controla tu negocio.</p>
          </div>
          <div className="relative w-full z-10">
            <img
              src={'/img/login/login-preview.png'}
              className="w-full h-90 flex justify-center items-center bottom-28 left-20 rounded-sm text-muted-foreground bg-muted dark:hidden"
            />
            <img
              src={'/img/login/login-dark-preview.png'}
              className="w-full h-90 hidden justify-center items-center bottom-28 left-20 rounded-sm text-muted-foreground bg-muted dark:flex"
            />
            <img
              src={'/img/login/login-chart.png'}
              alt="Demo de Gráfica"
              className="w-52 h-auto absolute -right-8 -top-12 block dark:hidden shadow-xl rounded-md"
            />
            <img
              src={'/img/login/login-chart-dark.png'}
              alt="Demo de Gráfica"
              className="w-52 h-auto absolute -right-8 -top-12 hidden dark:block shadow-lg shadow-muted-foreground/20 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
