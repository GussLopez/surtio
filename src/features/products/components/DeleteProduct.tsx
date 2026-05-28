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
} from "@/shared/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { sileo } from "sileo"
import { Spinner } from "../../../components/ui/spinner"

interface ProductModalProps {
  open: boolean
  onClose: () => void
  productId: string | null
}

export function DeleteProduct({ open, onClose, productId }: ProductModalProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {

      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-products"] });
      sileo.success({
        title: 'Producto eliminado',
        description: 'El producto se elimino correctamente',
      })
    },
    onError: (error) => {
      sileo.error({
        title: "Acceso denegado",
        description: error.message || "No tienes permisos para realizar esta acción",
      });
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el producto permanentemente y no se podrá recuperar.
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
