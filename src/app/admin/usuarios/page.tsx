'use client'
import UserCard from "@/features/users/components/userCard";
import CreateUser from "@/features/users/components/CreateUserModal";
import DeleteUserModal from "@/features/users/components/DeleteUserModal";
import EditUserModal from "@/features/users/components/EditUserModal";
import ServerError from "@/shared/components/ui/server-error";
import { Spinner } from "@/shared/components/ui/spinner";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { useQuery } from "@tanstack/react-query"
import { UserRoundSearch, Users } from "lucide-react";
import { useState } from "react";

export interface editEmploye {
  id: string;
  name: string;
  email: string;
  role: string
}

type ModalState =
  | { type: "edit"; employe: editEmploye }
  | { type: "delete"; employeId: string }
  | null

interface UsersType {
  role: string;
  created_at: string | null;
  profiles: {
    avatar_url: string | null;
    created_at: string | null;
    email: string;
    full_name: string | null;
    id: string;
    is_active: boolean;
    is_blocked: boolean | null;
    last_login_at: string | null;
    last_name: string | null;
    phone: string | null;
  };
}
export default function UsuariosPage() {
  const businessId = useBusinessStore(state => state.id);
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, error } = useQuery<UsersType[]>({
    queryKey: ["business-users", businessId],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ businessId })
      });
      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: !!businessId
  })

  const openEdit = (employe: editEmploye) =>
    setModal({ type: "edit", employe })

  const openDelete = (employeId: string) =>
    setModal({ type: "delete", employeId })

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center gap-3">
          <Users size={30} />
          <h1 className="text-3xl font-semibold">Gestión de usuarios</h1>
        </div>
        <div className="mt-5 lg:mt-0">
          <CreateUser />
        </div>
      </div>
      {error && (
        <ServerError />
      )}
      {isLoading && (
        <div className="flex justify-center mt-40">
          <Spinner className="size-7" />
        </div>
      )}
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center max-w-sm gap-2 mx-auto py-20">
          <div className="p-2 rounded-lg text-primary bg-primary/10">
            <UserRoundSearch size={30} />
          </div>
          <p className="font-medium text-accent-foreground">No hay usuarios</p>
          <p className="text-sm/relaxed text-center text-muted-foreground px-6">
            No hay usuarios registrados. Empieza creando un usuario.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
          {data?.map((user) => (
            <UserCard
              key={user.profiles.id}
              user={user.profiles}
              onEdit={openEdit}
              onDelete={openDelete}
              role={user.role}
            />
          ))}
        </div>
      )}
      {modal?.type === 'edit' && (
        <EditUserModal
          open
          employe={modal.employe}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteUserModal
          open
          userId={modal.employeId}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
