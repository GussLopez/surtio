'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessStore } from "@/store/BusinessStore";
import { useUserStore } from "@/store/UserStore";
import { Business } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sileo } from "sileo";

interface DeleteBusinessProps {
  isLoading: boolean;
  businessId: string;
  businessName: string;
}

export default function DeleteBusinessDialog({ isLoading, businessId, businessName }: DeleteBusinessProps) {
  const [open, setOpen] = useState(false);
  const userId = useUserStore((state) => state.id);
  const setBusiness = useBusinessStore(state => state.setBusiness);
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error fetching');

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", userId] });
      sileo.success({
        title: 'Tienda eliminada',
        description: 'La tienda se eliminó correctamente'
      });
      const data = queryClient.getQueryData<Business[]>(["business", userId]);
      if (data?.length) {
        const business = data[0]
        setBusiness({
          id: business.id,
          name: business.name,
          owner_id: business.owner_id,
          plan: business.plan
        })
        
        router.push('/admin');
        router.refresh();
      } else {
        router.push('/admin/new');
      }
    },
    onError: (err) => {
      sileo.error({
        title: 'Error al eliminar la tienda',
        description: 'Ocurrió un error, por favor contactar a soporte'
      });
      console.error(err);
    }
  })

  useEffect(() => {
    if (inputValue === businessName) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  }, [inputValue])

  const handleDelete = () => {
    if (confirmed) {
      mutate();
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'destructive'}
          size={'sm'}
          className="rounded-[5px] font-semibold cursor-pointer"
          disabled={isLoading}
        >
          Eliminar Tienda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Eliminar Tienda</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>¿Está seguro de que desea eliminar esta Tienda?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Label htmlFor="businessDelete" className="mb-2">
            Escribe <span className="font-bold">"{businessName}"</span> abajo para confirmar.
          </Label>
          <Input
            id="businessDelete"
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <DialogFooter className="sm:justify-start mt-5">
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            disabled={!confirmed && true || isPending}
          >
            {isPending ? (
              <>
                Eliminando
                <Spinner />
              </>
            ) : 'Eliminar Tienda'}
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
