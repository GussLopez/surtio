import { useUserStore } from "@/shared/store/UserStore";

export default function Can({ roles, children }: { roles: string[], children: React.ReactNode }) {
  const role = useUserStore(state => state.role)

  if (!role) return null;

  return roles.includes(role) ? <>{children}</> : null;
}