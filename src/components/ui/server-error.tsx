'use client'
import Link from "next/link";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { CloudLightning, MessageCircle, RefreshCw } from "lucide-react";

export default function ServerError() {
  const { theme } = useTheme();
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-125 rounded-xl overflow-hidden mt-10 transition-colors duration-300">

      {/* Fondo con Gradiente Radial adaptativo */}
      {/* Dark Mode: Púrpura profundo a transparente */}
      {/* Light Mode: Gris suave/azul a transparente */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-40"
        style={{
          background: 'radial-gradient(circle at center, var(--error-glow) 0%, transparent 75%)'
        }}>
      </div>

      {/* Inyección de color variable vía CSS inline para facilitar el control */}
      <style jsx>{`
        div {
          --error-glow: #e2e8f0; /* Default Light Mode (slate-200) */
        }
        :global(.dark) div {
          --error-glow: #3b0764; /* Dark Mode (purple-950) */
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Espacio para el Avatar/Memoji */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
         <CloudLightning size={40} />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Woah!
        </h2>

        <p className="text-base md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
          Parece que el servidor está un poco molesto <br /> y no quiere responder :(
        </p>

        {/* Botón usando tus componentes de UI (Shadcn) */}
        <Button
          variant="default"
          size="lg"
          onClick={() => window.location.reload()}
          className="rounded-full px-10 h-12 font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>

        {/* Soporte */}
        <button className="flex items-center gap-2 mt-8 text-sm text-muted-foreground hover:text-primary transition-colors group">
          <MessageCircle className="w-4 h-4 group-hover:animate-pulse" />
          <span>¿Necesitas ayuda?</span>
        </button>
      </div>
    </div>
  );
}
