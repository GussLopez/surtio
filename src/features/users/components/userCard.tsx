'use client'
import { UserIcon } from "@phosphor-icons/react";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronDown, Crown, Edit, Mail, Shield, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Button } from "@/shared/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { editEmploye } from "@/app/admin/usuarios/page";

interface UserCardProps {
  user: {
    full_name: string | null;
    id: string;
    email: string;
  }
  role: string
  onEdit: (employe: editEmploye) => void;
  onDelete: (employeId: string) => void;
}

const gradientVariants = {
  admin: 'from-orange-400 to-red-600',
  seller: 'from-cyan-400 to-blue-600',
  stockMan: 'from-yellow-400 to-amber-600',
  owner: 'from-rose-400 to-red-600',
}

const roleActions = {
  owner: ['Acceso completo'],
  admin: [
    'Gestionar inventario',
    'Gestionar entradas',
    'Gestionar proveedores',
    'Gestionar ventas',
    'Modificar ventas',
    'Ver historial de ventas'
  ],
  seller: [
    'Registrar ventas',
    'Ver historial de ventas',
    'Ver inventario'
  ],
  'stock-man': [
    'Gestionar inventario',
    'Eliminar productos',
    'Gestionar entradas',
    'Gestionar proveedores'
  ]
}
export default function UserCard({ user, role, onEdit, onDelete }: UserCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md overflow-hidden bg-facent">
      <div className={`h-24 w-full bg-linear-to-br relative
         ${role === 'admin' && gradientVariants.admin || role === 'seller' && gradientVariants.seller || role === 'stock-man' && gradientVariants.stockMan || role === 'owner' && gradientVariants.owner}`
      }>
        {role === 'owner' && (
          <div className="absolute top-4 left-4 text-yellow-300">
            <Crown size={20} className="fill-yellow-300" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={'secondary'}>
            {role === 'admin' && 'Administrador'}
            {role === 'seller' && 'Vendedor'}
            {role === 'stock-man' && 'Almacenista'}
            {role === 'owner' && 'Propietario'}
          </Badge>
        </div>
        <div className="absolute -bottom-10 left-4">
          <div className="h-20 w-20 flex justify-center items-center rounded-full border-4 border-input overflow-hidden ring-2 ring-input/40 bg-accent">
            <UserIcon size={40} weight="bold" className="text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="px-4 pt-12 pb-6">
        <p className="text-lg font-semibold">{user.full_name}</p>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
          <Mail size={13} />
          <p>{user.email}</p>
        </div>
        <div className="p-3 rounded-md bg-background mt-3">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <div className="w-full flex justify-between text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div>
                    <Shield size={15} />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold">Acceso</span>
                </div>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>

              {open && (
                <CollapsibleContent forceMount asChild>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="py-4">
                      <ul className="text-xs space-y-2 pl-4">
                        {roleActions[role as keyof typeof roleActions]?.map((permiso, index) => (
                          <li key={index}>
                            {permiso}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm mt-4 font-medium border-t pt-2">Acceso completo</p>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-3 items-stretch">
        <div className="w-4/5">
          <Button
            className="w-full"
            size={'lg'}
            variant={'outline'}
            onClick={() => onEdit({
              id: user.id,
              name: user.full_name!,
              email: user.email,
              role: role,
            })}
          >
            <Edit size={40} />
            Editar
          </Button>
        </div>
        <div className="w-1/5">
          <Button
            className="w-full text-red-500 hover:border-red-400 hover:bg-red-400/20 hover:text-red-500  dark:hover:bg-red-600/10 dark:hover:text-red-500"
            size={'icon-lg'}
            variant={'outline'}
            onClick={() => onDelete(user.id)}
            disabled={role === "owner"}
          >
            <Trash2 size={40} className="size-4.5" />
            <span className="sr-only">Eliminar un usuario</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
