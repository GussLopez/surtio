'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { sileo } from "sileo";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  supplierId: number;
}
export default function DeleteSupplierDialog({ open, onClose, supplierId }: ProductModalProps) {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE'
      })
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-suppliers"] });
      sileo.success({
        title: 'Proveedor eliminado',
        description: 'El proveedor se elimino correctamente',
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
          <AlertDialogTitle>¿Eliminar Proveedor?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el proveedor permanentemente y no se podrá recuperar.
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
