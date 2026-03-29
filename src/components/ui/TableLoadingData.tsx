import { Skeleton } from "./skeleton";
import { TableRow, TableCell } from "./table";

interface TableLoadingProps {
  variant: 'imageStart' | 'dateStart'
  totalRows?: number
}

export default function TableLoadingData({ variant, totalRows = 6 }: TableLoadingProps) {

  return (
    <>
      {[...Array(totalRows)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            {variant === 'dateStart' ? (
              <div className="flex gap-1.5">
                <Skeleton className="w-5 h-3 rounded-xs" />
                <Skeleton className="w-5 h-3 rounded-xs" />
                <Skeleton className="w-12 h-3 rounded-xs" />
              </div>
            ) : (
              <div>
                <Skeleton className="w-20 h-20" />
              </div>
            )}
          </TableCell>
          <TableCell>
            <Skeleton className="w-full h-3 rounded-xs" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-14 h-4" />
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Skeleton className="w-10 h-3 rounded-xs" />
              <Skeleton className="w-20  h-3 rounded-xs" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="w-10 h-4 rounded-xs" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-10 h-2 rounded-xs" />
            <Skeleton className="w-20 h-2 rounded-xs mt-1.5" />
          </TableCell>
          <TableCell className="text-end">
            <div className="flex justify-end">
              <Skeleton className="w-8 h-8" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
