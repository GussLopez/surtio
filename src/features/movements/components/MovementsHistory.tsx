'use client'

import { DownloadSimpleIcon, FileTextIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { Badge, Trash2 } from "lucide-react"
import { useState } from "react"
import { DeleteMovement } from "./DeleteMovement"
import { DateRange } from "react-day-picker"
import { useBusinessStore } from "@/store/BusinessStore"
import { Movement, Profile } from "@/types"
import { RangeDatePicker } from "@/shared/components/ui/range-date"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import TableLoadingData from "@/components/ui/TableLoadingData"

type ModalState =
  | { type: "delete"; movementId: number }
  | null

interface UsersData {
  role: string;
  created_at: string;
  profiles: Profile;
}

export default function MovementsHistory() {
  const [modal, setModal] = useState<ModalState>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const businessId = useBusinessStore(state => state.id);

  const [selectedUser, setSelectedUser] = useState("ninguno")
  const { data, isLoading, error } = useQuery<Movement[]>({
    queryKey: ["business-movements", businessId, selectedUser, dateRange],
    queryFn: async () => {
      const res = await fetch('/api/movements/search', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUser,
          businessId,
          dateRange
        })
      })
      if (!res.ok) throw new Error("Error fetching");

      return res.json();
    },
    retry: 1,
  })

  const { data: profiles, isLoading: loadingProfiles } = useQuery<UsersData[]>({
    queryKey: ["business-users"],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true,
  })
  console.log(profiles);
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mt-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <RangeDatePicker date={dateRange} setDate={setDateRange} />
          <Select
            value={selectedUser}
            onValueChange={value => setSelectedUser(value)}
          >
            <SelectTrigger className="w-full lg:w-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Empleados</SelectLabel>
                <SelectItem value="ninguno">Todos</SelectItem>
                {loadingProfiles && <p className="p-2 text-sm  text-muted-foreground">Cargando...</p>}
                {profiles?.length === 0 ? (
                  <p className="p-2 text-sm  text-muted-foreground">No hay empleados registrados</p>
                ) : (
                  profiles?.map((profile) => (
                    <SelectItem
                      key={profile.profiles.id}
                      value={profile.profiles.id}
                    >
                      {profile.profiles.full_name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 mt-5 lg:mt-0">
          <Button
            variant={'outline'}
            disabled={data?.length === 0}
          >
            <FileTextIcon size={20} weight="bold" />
            PDF Lista
          </Button>
          <Button
            variant={'outline'}
            disabled={data?.length === 0}
          >
            <DownloadSimpleIcon size={20} weight="bold" />
            CSV
          </Button>
        </div>
      </div>
      <div className="mt-5 border border-input rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-end">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableLoadingData
                columns={['date', 'text', 'smallText', 'text', 'number', 'doubleText', 'actions']}
                totalRows={5}
              />
            )}
            {data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay movimientos
                </TableCell>
              </TableRow>
            ) : (
              data?.map((movement) => {
                const date = new Date(movement.created_at)
                return (
                  <TableRow key={movement.id}>
                    <TableCell>{date.toLocaleDateString()}</TableCell>
                    <TableCell>{movement.profiles?.full_name}</TableCell>
                    <TableCell>
                      <Badge className="capitalize">{movement.type}</Badge>
                    </TableCell>
                    <TableCell className="truncate text-muted-foreground">
                      <span className="font-mono text-accent-foreground">#{movement.products.sku}</span> - {movement.products.name}
                    </TableCell>
                    <TableCell className="font-semibold">{movement.quantity}</TableCell>
                    <TableCell className="truncate max-w-20 text-muted-foreground">{movement.reference || '-'}</TableCell>
                    <TableCell className="text-end">
                      <Button
                        size={'icon-sm'}
                        variant={'ghost'}
                        className="text-red-500 bg-red-600/10 hover:text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-600/30"
                        onClick={() => setModal({
                          type: "delete",
                          movementId: movement.id
                        })}
                      >
                        <Trash2 />
                        <span className="sr-only">Eliminar registro</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      {modal?.type === "delete" && (
        <DeleteMovement
          open
          movementId={modal.movementId}
          onClose={() => setModal(null)}
        />
      )}
    </div >
  )
}
