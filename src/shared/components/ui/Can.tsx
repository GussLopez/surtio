import { getMyRole } from "@/shared/services/userService";
import { useBusinessStore } from "@/shared/store/BusinessStore";
import { useEffect, useState } from "react";

export default function Can({ roles, children }: { roles: string[], children: React.ReactNode }) {
  const businessId = useBusinessStore(state => state.id)
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getMyRole(businessId!).then(setRole);
  }, []);

  if (!role) return null;

  return roles.includes(role) ? <>{children}</> : null;
}