'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/animate/tabs";
import MovementsHistory from "@/features/movements/components/MovementsHistory";
import RegisterMovement from "@/features/movements/components/RegisterMovement";
import { ArrowRightLeft, FolderInput, History } from "lucide-react";
import { useState } from "react";

export default function EntradasPage() {
  const [view, setView] = useState("register")

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center gap-3">
          <ArrowRightLeft size={30} />
          <h1 className="text-3xl font-semibold">Entradas / Salidas</h1>
        </div>
        <div className="flex items-center gap-4 mt-5 lg:mt-0">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="register">
                <FolderInput />
                Registrar
              </TabsTrigger>
              <TabsTrigger value="record">
                <History />
                Historial
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {view === 'register' ? (
        <RegisterMovement />
      ) : (
        <MovementsHistory />
      )}
    </div >

  )
}
