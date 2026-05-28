'use client'

import { ReactNode } from "react";
import Preloader from "@/shared/components/ui/preloader";
import { useUserStore } from "@/store/UserStore";
import { useBusinessStore } from "@/store/BusinessStore";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const userId = useUserStore((state) => state.id);
  const businessId = useBusinessStore((state) => state.id);

  const isReady = !!userId && !!businessId;

  return (
    <>
      <Preloader isReady={isReady} />
      {children}
    </>
  );
}