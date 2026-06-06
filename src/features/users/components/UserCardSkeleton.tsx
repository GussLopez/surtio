import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UserCardSkeleton() {

  return (
    <div className="bg-red-50">
      <div className={`h-24 w-full bg-linear-to-br relative`}>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="absolute -bottom-10 left-4">
          <Skeleton className="h-20 w-20 flex justify-center items-center rounded-full" />
        </div>
        <div>
          <Skeleton className="w-1/2 h-5" />
          <Skeleton className="w-25 h-4" />
        </div>
      </div>

    </div>
  )
}
