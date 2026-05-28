'use client'

import { useUserStore } from "@/store/UserStore";
import { Profile } from "@/types";
import { UserIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { SquarePen, UserSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import InfoItem from "./InfoItem";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState } from "react";
import EditUserDrawer from "@/shared/components/EditUserDrawer";

type ModalState =
  | { type: "editAvatar"; user: Profile }
  | { type: "editUser"; user: Profile }
  | { type: "delete"; userId: string, userName: string }
  | null

interface ProfileData {
  avatar_url: string | null;
  created_at: string | null;
  email: string;
  full_name: string | null;
  id: string;
  is_active: boolean;
  is_blocked: boolean | null;
  last_login_at: string | null;
  last_name: string | null;
  phone: string | null;
  memberships: {
    role: string;
  }[];
}

export default function MyProfile() {
  const userId = useUserStore(state => state.id);
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, error } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'GET'
      });
      return res.json();
    },
    retry: 1,
    enabled: !!userId
  })

  const openEdit = (user: Profile) => setModal({ type: "editUser", user });
  const openDelete = (userId: string, userName: string) => setModal({ type: "delete", userId, userName });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-card p-6 rounded-xl border border-muted relative">
        <div>
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-full" />
          ) : (
            <div className="h-20 w-20 flex justify-center items-center rounded-full border-4 border-input overflow-hidden ring-2 ring-input/40 bg-accent">
              <UserIcon size={40} weight="bold" className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          {isLoading
            ? <Skeleton className="w-50 h-4" />
            : <h1 className="text-xl font-semibold">{data?.full_name} {data?.last_name}</h1>
          }
          {isLoading ? (
            <Skeleton className="w-26 h-3 mt-3" />
          ) : (
            data?.memberships.map((item, i) => (
              <p
                key={i}
                className="text-sm font-medium text-muted-foreground"
              >
                {item.role === 'owner' && 'Propietario'}
              </p>
            ))
          )}
        </div>
        {data && (
          <EditUserDrawer user={data}>
            <Button
              className="absolute top-3 right-5 transition-all duration-200 ease-in-out rounded-full"
              variant={'outline'}
              size={'sm'}
              disabled={isLoading}
            >
              <SquarePen />
              <span className="sr-only">Editar información del negocio</span>
            </Button>
          </EditUserDrawer>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="col-span-3 bg-card p-5 rounded-xl border border-muted space-y-4 relative">
          {data && (
            <EditUserDrawer user={data}>
              <Button
                className="absolute top-3 right-5 transition-all duration-200 ease-in-out rounded-full"
                variant={'outline'}
                size={'sm'}
                disabled={isLoading}
              >
                <SquarePen />
                <span className="sr-only">Editar información del negocio</span>
              </Button>
            </EditUserDrawer>
          )}
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider">
            <UserSquare size={18} />
            <span>Información personal</span>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-3">
              <InfoItem
                label="Nombre"
                value={data?.full_name}
                isLoading={isLoading}
              />
              <InfoItem
                label="Correo"
                value={data?.email}
                isLoading={isLoading}
              />
              <InfoItem
                label="ID de Usuario"
                value={data?.id}
                isCode
                isLoading={isLoading}
              />
            </div>
            <div className="space-y-3">
              <InfoItem
                label="Apellido"
                value={data?.last_name}
                isLoading={isLoading}
              />
              <InfoItem
                label="Teléfono"
                value={data?.phone}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>
        <section className="bg-card p-5 rounded-xl border border-muted md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-destructive">
            <span>Zona de peligro</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Las acciones en esta sección son permanentes y no se pueden deshacer</p>
          <div className="mt-3">
            <Button
              variant={'destructive'}
              size={'sm'}
              className="rounded-[5px] font-semibold cursor-pointer"
              onClick={() => openDelete(data?.id!, data?.full_name!)}
              disabled
            >
              Eliminar Cuenta
            </Button>
            <p className="text-[11px] mt-1 text-muted-foreground">Eliminar permanentemente la cuenta y todos las tiendas asociadas</p>
          </div>
        </section>
      </div>
    </div>
  )
}
