'use client'
import AddSupplierDialog from "@/shared/components/AddSupplierDialog";
import DeleteSupplierDialog from "@/features/suppliers/components/DeleteSupplierDialog";
import EditSupplierDialog from "@/features/suppliers/components/EditSupplierDialog";
import { Badge } from "@/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import TableLoadingData from "@/shared/components/ui/TableLoadingData";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { Supplier } from "@/shared/types";
import { CircleIcon, PlusIcon, TruckTrailerIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle, ArrowUpDown, MoreHorizontal, PencilIcon, Plus, Search, SlidersHorizontal, Trash2Icon, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

type ModalState =
  | { type: "create" }
  | { type: "edit", supplier: Supplier }
  | { type: "delete", supplierId: number }
  | null
export default function ProveedoresPage() {
  const [modal, setModal] = useState<ModalState>(null);
  const businessId = useBusinessStore(state => state.id);

  const { data, isLoading } = useQuery<Supplier[]>({
    queryKey: ["business-suppliers", businessId],
    queryFn: async () => {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      });

      if (!res.ok) throw new Error("Error fetching");

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: !!businessId
  })

  const openCreate = () => setModal({ type: "create" });
  const openEdit = (supplier: Supplier) => setModal({ type: "edit", supplier })
  const openDelete = (supplierId: number) => setModal({ type: "delete", supplierId })

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <div className={cn(data?.length === 0 ? 'hidden' : 'block', "mt-5 lg:mt-0")}>
          <Button onClick={() => openCreate()}>
            <PlusIcon weight="bold" className="size-5" />
            Nuevo Proveedor
          </Button>
        </div>
      </div>
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 mx-auto py-10 mt-10 bg-background rounded-lg shadow-xs">
          <div className="p-2 rounded-lg text-primary bg-primary/10">
            <TruckTrailerIcon size={30} />
          </div>
          <p className="font-medium text-accent-foreground">No hay proveedores</p>
          <p className="text-sm/relaxed text-center text-muted-foreground px-6">No se han regostrado ningún proveedor. Empieza creando un proveedor.</p>
          <div className="flex items-center gap-3 mt-4">
            <Button variant={'outline'}>
              <ArrowUpCircle />
              Importar proveedores
            </Button>
            <Button onClick={() => openCreate()}>
              <Plus />
              Agregar Proveedor
            </Button>

          </div>
        </div>
      ) : (
        <div className="mt-10 border border-input rounded-lg overflow-hidden bg-background p-4">
          <div className="flex gap-4">
            <div className="w-full relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground/80" />
              <Input
                className="pl-8"
                placeholder="Filtrar proveedores"
              />
            </div>
            <Select>
              <SelectTrigger>
                <ArrowUpDown />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="end"
                className="min-w-60"
              >
                <SelectItem value="a-z">Nombre (A - Z)</SelectItem>
                <SelectItem value="a-z">Nombre (Z - A)</SelectItem>
                <SelectItem value="a-z">Últimos creados</SelectItem>
                <SelectItem value="a-z">Primeros creados</SelectItem>
                <SelectItem value="a-z">Menos compras</SelectItem>
                <SelectItem value="a-z">Más compras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 border border-input rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Nombre de contacto</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead className="text-end">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableLoadingData
                    columns={['longText', 'longText', 'badge', 'actions']}
                    totalRows={8}
                  />
                )}
                {data?.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell
                      className={`${supplier.contact_name ? '' : 'italic text-muted-foreground'}`}
                    >
                      {supplier.contact_name || 'No disponible'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={'outline'}
                        className={`${supplier.is_active ? 'border-primary/40 text-primary-light' : 'text-muted-foreground'}`}>

                        {supplier.is_active ? (
                          <>
                            <div>
                              <CircleIcon size={5} weight="fill" className="text-primary/60" />
                            </div>
                            Activo
                          </>
                        ) : (
                          <>
                            <div>
                              <CircleIcon size={5} weight="fill" className="text-neutral-400/60" />
                            </div>
                            Inactivo
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 ">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEdit(supplier)}>
                              <PencilIcon />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup onClick={() => openDelete(supplier.id)}>
                            <DropdownMenuItem variant="destructive">
                              <Trash2Icon />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {modal?.type === "create" && (
        <AddSupplierDialog
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "edit" && (
        <EditSupplierDialog
          open
          onClose={() => setModal(null)}
          supplier={modal.supplier}
        />
      )}

      {modal?.type === 'delete' && (
        <DeleteSupplierDialog
          open
          onClose={() => setModal(null)}
          supplierId={modal.supplierId}
        />
      )}
    </div>
  )
}
