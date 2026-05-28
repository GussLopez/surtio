'use client'

import { deleteEmploye } from "@/app/lib/action";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { sileo } from "sileo";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}
export default function DeleteUserModal({ open, onClose, userId }: ProductModalProps) {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteEmploye(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-users"] });
      sileo.success({
        title: 'Empleado eliminado',
        description: 'El empleado se elimino correctamente',
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
          <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el empleado permanentemente y no se podrá recuperar.
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
