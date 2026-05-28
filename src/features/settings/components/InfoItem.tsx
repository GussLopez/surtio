'use client'
import { Badge } from "../../../shared/components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

export default function InfoItem({
  label,
  value,
  icon,
  isCode = false,
  isBadge = false,
  isLoading
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  isCode?: boolean;
  isBadge?: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase font-bold text-muted-foreground/70 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      {isLoading ? (
        <Skeleton  className="w-26 h-2"/>
      ) : (
        isBadge ? (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20 shadow-none">
            {value || "N/A"}
          </Badge>
        ) : (
          <p className={`text-sm font-semibold ${isCode ? 'font-mono text-xs text-muted-foreground' : 'text-foreground'} ${label === 'Moneda' && 'uppercase'}`}>
            {value || "—"}
          </p>
        )
      )
      }
    </div >
  );
}