'use client'
import AddSupplierDialog from "@/shared/components/AddSupplierDialog";
import DeleteSupplierDialog from "@/features/suppliers/components/DeleteSupplierDialog";
import EditSupplierDialog from "@/features/suppliers/components/EditSupplierDialog";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Badge } from "@/shared/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import TableLoadingData from "@/components/ui/TableLoadingData";
import { useBusinessStore } from "@/store/BusinessStore";
import { Supplier } from "@/types";
import { CircleIcon, PlusIcon, TruckTrailerIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, PencilIcon, SlidersHorizontal, Trash2Icon, Truck } from "lucide-react";
import { useState } from "react";

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
        <div className="flex items-center gap-3">
          <Truck size={30} />
          <h1 className="text-3xl font-semibold">Proveedores</h1>
        </div>
        <div className="mt-5 lg:mt-0">
          <Button onClick={() => openCreate()}>
            <PlusIcon size={20} weight="bold" />
            Nuevo Proveedor
          </Button>
        </div>
      </div>
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center max-w-sm gap-2 mx-auto py-10 mt-10">
          <div className="p-2 rounded-lg text-primary bg-primary/10">
            <TruckTrailerIcon size={30} />
          </div>
          <p className="font-medium text-accent-foreground">No hay proveedores</p>
          <p className="text-sm/relaxed text-center text-muted-foreground px-6">No se han regostrado ningún proveedor. Empieza creando un proveedor.</p>
        </div>
      ) : (
        <div className="mt-10 border border-input rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
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
