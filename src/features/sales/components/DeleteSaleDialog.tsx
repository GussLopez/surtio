'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "../../../shared/components/ui/alert-dialog";
import { Button } from "../../../shared/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { sileo } from "sileo";
import { Spinner } from "../../../shared/components/ui/spinner";

interface DeleteSaleDialogProps {
  open: boolean;
  onClose: () => void;
  saleId: string;
}

export default function DeleteSaleDialog({ open, onClose, saleId }: DeleteSaleDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error deleting sale');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-reports"] });
      sileo.success({
        title: 'Venta eliminado',
        description: 'La venta se elimino correctamente',
        autopilot: false
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
          <AlertDialogMedia className="rounded-xl bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar venta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará la venta pero no modificará el stock del los productos vendidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-3">
          <AlertDialogCancel asChild>
            <Button variant={'outline'}>Cancelar</Button>
          </AlertDialogCancel>
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
