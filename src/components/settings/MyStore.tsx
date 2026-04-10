'use client'

import { getBusinessById } from "@/lib/services/businessService"
import { useBusinessStore } from "@/store/BusinessStore"
import { useQuery } from "@tanstack/react-query"
import {
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  SquarePen,
  Store,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import InfoItem from "../ui/InfoItem";
import { Skeleton } from "../ui/skeleton";
import { Business } from "@/types";
import { useState } from "react";
import DeleteBusinessDialog from "../admin/business/DeleteBusinessDialog";
import EditBusinessDrawer from "../admin/business/EditBusinessDrawer";

type ModalState =
  | { type: "editLogo"; business: Business }
  | { type: "editBussines"; business: Business, variant: 'name' | 'contact' | 'legal' }
  | { type: "delete"; businessId: string, businessName: string }
  | null

export default function MyStore() {
  const businessId = useBusinessStore(state => state.id);
  const [modal, setModal] = useState<ModalState>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["current-business", businessId],
    queryFn: async () => await getBusinessById(businessId!)
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = (businessId: string, businessName: string) =>
    setModal({ type: "delete", businessId, businessName });

  const handleEdit = (business: Business, variant: 'name' | 'contact' | 'legal') =>
    setModal({ type: "editBussines", business, variant });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-card p-6 rounded-xl border border-muted relative group">
        {isLoading ? (
          <Skeleton className="size-24 rounded-2xl" />
        ) : (
          <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
            {data?.logo ? (
              <img src={data.logo} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <Store className="size-10 text-primary" />
            )}
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <>
                <Skeleton className="w-40 h-5" />
                <Skeleton className="w-15 h-4" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">{data?.name}</h1>
                <Badge variant="secondary" className={`border-transparent uppercase tracking-wide ${data?.plan === 'pro' && 'bg-linear-to-r from-pink-500 to-orange-500 bg-size-[105%] bg-center text-white'}`}>
                  {data?.plan}
                </Badge>
              </>
            )
            }
          </div>
          {isLoading ? (
            <Skeleton className="w-50 h-2 mt-3" />
          ) : (
            <p className="text-muted-foreground text-sm max-w-2xl">
              {data?.description || "Sin descripción del negocio configurada."}
            </p>
          )}
        </div>
        <Button
          className="absolute top-3 right-3 opacity-0 scale-95 group-hover:opacity-100 transition-all duration-200 ease-in-out rounded-full"
          variant={'outline'}
          size={'sm'}
          disabled={isLoading}
          onClick={() => handleEdit(data!, 'name')}
        >
          <SquarePen />
          <span className="sr-only">Editar información del negocio</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-card p-5 rounded-xl border border-muted space-y-4 relative group">
          <Button
            className="absolute top-3 right-5 opacity-0 scale-95 group-hover:opacity-100 transition-all duration-200 ease-in-out rounded-full"
            variant={'outline'}
            size={'sm'}
            disabled={isLoading}
            onClick={() => handleEdit(data!, 'legal')}
          >
            <SquarePen />
            <span className="sr-only">Editar información del negocio</span>
          </Button>
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider">
            <FileText size={18} />
            <span>Identidad Legal</span>
          </div>
          <Separator />
          <div className="space-y-3">
            <InfoItem
              label="Razón Social"
              value={data?.legal_name}
              isLoading={isLoading}
            />
            <InfoItem
              label="RFC / Tax ID"
              value={data?.rfc}
              isLoading={isLoading}
            />
            <InfoItem
              label="ID de Negocio"
              value={data?.id}
              isCode
              isLoading={isLoading}
            />
          </div>
        </section>

        <section className="bg-card p-5 rounded-xl border border-muted space-y-4 md:col-span-2 group relative">
          <Button
            className="absolute top-3 right-5 opacity-0 scale-95 group-hover:opacity-100 transition-all duration-200 ease-in-out rounded-full"
            variant={'outline'}
            size={'sm'}
            disabled={isLoading}
            onClick={() => handleEdit(data!, "contact")}
          >
            <SquarePen />
            <span className="sr-only">Editar información del negocio</span>
          </Button>
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider">
            <MapPin size={18} />
            <span>Contacto y Ubicación</span>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-3">
              <InfoItem
                icon={<Mail size={14} />}
                label="Correo Electrónico"
                value={data?.email}
                isLoading={isLoading}
              />
              <InfoItem
                icon={<Phone size={14} />}
                label="Teléfono"
                value={data?.phone}
                isLoading={isLoading}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground/70">Dirección Física</p>
              <p className="text-sm font-medium leading-relaxed">
                {data?.address ? (
                  <>
                    {data.address}<br />
                    {data.city}, {data.state}. CP {data.zip_code}<br />
                    {data.country}
                  </>
                ) : (
                  <span className="text-muted-foreground italic">Dirección no registrada</span>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card p-5 rounded-xl border border-muted space-y-4 md:col-span-3">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider">
            <Globe size={18} />
            <span>Preferencias del Sistema</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoItem
              icon={<CreditCard size={14} />}
              label="Moneda"
              value={data?.currency}
              isLoading={isLoading}
            />
            <InfoItem
              icon={<Clock size={14} />}
              label="Zona Horaria"
              value={data?.timezone}
              isLoading={isLoading}
            />
            <InfoItem
              icon={<CalendarDays size={14} />}
              label="Miembro desde"
              value={data?.created_at ? formatDate(data.created_at) : null}
              isLoading={isLoading}
            />
            <InfoItem
              label="Estado de Cuenta"
              value="Activo"
              isBadge
            />
          </div>
        </section>

        <section className="bg-card p-5 rounded-xl border border-muted md:col-span-1">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider">
            <TriangleAlert size={18} />
            <span>Zona de peligro</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Las acciones en esta sección son permanentes y no se pueden deshacer</p>
          <div className="mt-3">
            <Button
              variant={'destructive'}
              size={'sm'}
              className="rounded-[5px] font-semibold cursor-pointer"
              onClick={() => handleDelete(data?.id!, data?.name!)}
              disabled={isLoading}
            >
              Eliminar Tienda
            </Button>
            <p className="text-[11px] mt-1 text-muted-foreground">Eliminar permanentemente la tienda y todos los datos asociados</p>
          </div>
        </section>
      </div>

      {modal?.type === "delete" && (
        <DeleteBusinessDialog
          open
          onClose={() => setModal(null)}
          businessId={modal.businessId}
          businessName={modal.businessName}
        />
      )}

      {modal?.type === "editBussines" && (
        <EditBusinessDrawer
          open
          onClose={() => setModal(null)}
          business={modal.business}
          variant={modal.variant}
        />
      )}
    </div>
  )
}