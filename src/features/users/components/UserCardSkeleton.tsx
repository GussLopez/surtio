import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UserCardSkeleton() {

  return (
    <div className="">
      <div className={`h-24 w-full bg-linear-to-br relative`}>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-4 w-17 rounded-full" />
        </div>
        <div className="absolute -bottom-10 left-4">
          <Skeleton className="h-20 w-20 flex justify-center items-center rounded-full" />
        </div>
      </div>

      <div className="mt-10 space-y-1 p-4">
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-3/4 h-3" />
      </div>

      <div className="flex gap-3 p-4 mt-5">
        <Skeleton className="w-4/5 h-10" />
        <Skeleton className="w-1/5 h-10" />
      </div>
    </div>
  )
}
