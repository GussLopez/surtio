import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UserCardSkeleton() {

  return (
    <div>
      <div className={`h-24 w-full bg-linear-to-br relative}`}>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="absolute -bottom-10 left-4">
          <Skeleton className="h-20 w-20 flex justify-center items-center rounded-full" />
        </div>
      </div>
    </div>
  )
}
