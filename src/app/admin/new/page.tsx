'use client'
import { Button } from "@/shared/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessStore } from "@/store/BusinessStore";
import { useUserStore } from "@/store/UserStore";
import { BusinessForm } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";

export default function NewBusiness() {
  const ownerId = useUserStore(state => state.id);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const business = useBusinessStore();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      plan: 'pro',
      description: '',
      legal_name: '',
      rfc: '',
      phone: '',
      email: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zip_code: '',
      owner_id: '',
      currency: 'mxn'
    }
  })

  useEffect(() => {
    if (ownerId) {
      setValue("owner_id", ownerId);
    }
  }, [ownerId, setValue]);

  const handleCreateBusinesss = async (formData: BusinessForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/businesses/create', {
        method: 'POST',
        body: JSON.stringify({ bData: formData })
      });

      if (!res.ok) throw new Error('Error fetching');

      const newBusiness = await res.json();
      business.clearBusiness();
      business.setBusiness({
        id: newBusiness.id,
        name: newBusiness.name,
        owner_id: newBusiness.owner_id,
        plan: newBusiness.plan
      })
      queryClient.invalidateQueries()
      sileo.success({
        title: 'Tienda creada correctamente'
      })
      router.push('/admin');
    } catch (error) {
      console.error(error);
      sileo.error({
        title: 'Error al crear la tienda',
        description: 'Ocurrió un error al crear la tienda, por favor intenta más tarde'
      })
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-3xl mx-auto border border-muted rounded-md bg-facent">
      <div className="px-4 py-3 mb-2 border-b border-input text-sm text-foreground/60">
        <h1 className="text-lg font-medium text-accent-foreground">Crea una tienda nueva</h1>
        <p className="">Tu tienda contará con su propia instancia dedicada, productos, proveedores, etc.</p>
        <p>Completa los datos para crear tu tienda.</p>
      </div>
      <form onSubmit={handleSubmit(handleCreateBusinesss)}>
        <div className="px-4 py-3 space-y-4 border-b border-input">
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="businessName">Nombre</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="businessName"
                placeholder="Nombre de la tienda"
                className="bg-white"
                aria-invalid={errors.name?.message ? 'true' : 'false'}
                {...register("name", {
                  required: 'El nombre es requerido'
                })}
              />
              <ErrorMessage>{errors.name?.message}</ErrorMessage>
              <p className="text-xs text-muted-foreground pt-1.5">¿Cuál es el nombre de tu negocio o empresa? Puedes cambiarlo más tarde.</p>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="businessName">Plan</Label>
            </div>
            <div className="col-span-8">
              <Controller
                control={control}
                name="plan"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="free">Gratis - $0/mes</SelectItem>
                      <SelectItem value="pro">Pro - $950/mes</SelectItem>
                      <SelectItem value="premium">Premium - $2500/mes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground pt-1.5">
                ¿Qué plan se adapta mejor a las necesidades de su negocio? {" "}
                <Link
                  href={'/pricing'}
                  target="_blank"
                  className="font-semibold text-primary-light hover:underline hover:text-primary"
                >Ver detalles</Link>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="currency">Tipo de Moneda</Label>
            </div>
            <div className="col-span-8">
              <Controller
                control={control}
                name="currency"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="mxn">
                        <img src='/img/currency/mexico.png' alt={`Mexico flag`} className='h-4 w-6' />{' '}
                        MXN
                      </SelectItem>
                      <SelectItem value="usd">
                        <img src='/img/currency/us.png' alt={`US flag`} className='h-4 w-6' />{' '}
                        USD
                      </SelectItem>
                      <SelectItem value="eur">
                        <img src='/img/currency/europe.png' alt={`Europe flag`} className='h-4 w-6' />{' '}
                        EUR
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="businessDescription">Descripción</Label>
            </div>
            <div className="col-span-8">
              <Textarea
                id="businessDescription"
                className="max-h-40 bg-white"
                {...register('description')}
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-y-4 border-b border-input">
          <h2 className="text-sm font-medium text-muted-foreground/70">Información del Negocio</h2>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="legalName">Razón social</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="legalName"
                placeholder="Razón social o denominación social"
                className="bg-white"
                {...register('legal_name')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="rfc">RFC</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="rfc"
                placeholder="RFC"
                className="bg-white"
                {...register('rfc')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="phoneNumber">Teléfono</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="phoneNumber"
                placeholder="123-456"
                className="bg-white"
                {...register('phone')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="email"
                placeholder="negocio@gmail.com"
                className="bg-white"
                {...register('email')}
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-y-4 border-b border-input">
          <h2 className="text-sm font-medium text-muted-foreground/70">Dirección</h2>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="country">País</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="country"
                className="bg-white"
                {...register('country')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="state">Estado</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="state"
                className="bg-white"
                {...register('state')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="city">Ciudad</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="city"
                className="bg-white"
                {...register('city')}
              />
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="address">Dirección</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="address"
                className="bg-white"
                {...register('address')}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <Label htmlFor="zipcode">Código postal</Label>
            </div>
            <div className="col-span-8">
              <Input
                id="zipcode"
                className="bg-white"
                {...register('zip_code')}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4 py-3">
          <div>
            <Button
              asChild
              size={'sm'}
              variant={'outline'}
            >
              <Link href={'/admin'}>Cancelar</Link>
            </Button>
          </div>
          <div>
            <Button
              size={'sm'}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Creando
                </>
              ) : 'Craer tienda'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
