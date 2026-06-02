import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { sileo } from "sileo";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import ErrorMessage from "@/shared/components/ui/error-message";
import { useBusinessStore } from "@/shared/store/BusinessStore";

interface CancelSaleProps {
  open: boolean;
  onClose: () => void;
  saleId: string;
}
export default function CancelSaleDialog({ open, onClose, saleId }: CancelSaleProps) {
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('')
  const queryClient = useQueryClient();
  const businessId = useBusinessStore(state => state.id);


  const { mutate, isPending } = useMutation({
    mutationFn: async (reason: string) => {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'POST',
        body: JSON.stringify({ cancelReason: reason })
      })

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-reports"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyRevenue", businessId] });
      sileo.success({
        title: 'Venta cancelada',
        description: 'La venta se canceló correctamente',
        autopilot: false
      })
      onClose();
    },
    onError: (error) => {
      sileo.error({
        title: 'Error al cancelar una venta',
        description: 'Ocurrió un error al cancelar la venta, por favor intente más tarde'
      })
      console.error(error);
    }
  })

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const reason = cancelReason.trim();

    if (reason.length < 5) {
      setError("El motivo debe tener al menos 5 caracteres");
      return;
    }
    setError("");
    mutate(reason);
  }
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cancelar venta?</DialogTitle>
          <DialogDescription>
            Esto revertirá el stock y ajustará deudas si aplica. Esta acción es irreversible.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Label>Motivo de cancelación</Label>
          <Textarea
            onChange={e => {
              setCancelReason(e.target.value);

              if (error) {
                setError("");
              }
            }}
            className="max-h-30"
          />
          <ErrorMessage>{error}</ErrorMessage>
        </div>
        <DialogFooter className="mt-3">
          <DialogClose asChild>
            <Button variant={'outline'}>Cancelar</Button>
          </DialogClose>
          <Button
            className="bg-yellow-500 hover:bg-yellow-500/90 text-black!"
            disabled={isPending || cancelReason.trim() === ''}
            onClick={handleSubmit}
          >
            {isPending ? (
              <>
                <Spinner />
                Cancelando
              </>
            ) : 'Cancelar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
