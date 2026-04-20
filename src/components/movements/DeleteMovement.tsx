import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { sileo } from "sileo"
import { Spinner } from "../ui/spinner"

interface MovementModalProps {
  open: boolean
  onClose: () => void
  movementId: number | null
}

export function DeleteMovement({ open, onClose, movementId }: MovementModalProps) {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/movements/${movementId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-movements"] });
      sileo.success({
        title: 'Registro eliminado',
        description: 'El registro se elimino correctamente',
      })
    },
    onError: (error) => {
      sileo.error({
        title: "Algo salió mal",
        description: "Por favor intente más tarde.",

      });
      console.error(error)
    },
  })
  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción solo elimina el registro del historial, no revierte el cambio de stock.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              mutate(undefined, {
                onSuccess: () => {
                  onClose();
                }
              })
            }}
          >
            {isPending ? (
              <>
                <Spinner />
                Eliminando
              </>
            ) : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
