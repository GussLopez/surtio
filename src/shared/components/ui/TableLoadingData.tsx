import { Skeleton } from "./skeleton";
import { TableRow, TableCell } from "./table";

type ColumnType =
  | 'image'
  | 'text'
  | 'smallText'
  | 'doubleText'
  | 'actions'
  | 'date'
  | 'number'
  | 'badge'
  | 'longText'

interface TableLoadingProps {
  columns: ColumnType[]
  totalRows?: number
}

export default function TableLoadingData({ columns, totalRows = 6 }: TableLoadingProps) {

  const renderSkeleton = (type: ColumnType) => {
    switch (type) {
      case 'image':
        return <Skeleton className="w-20 h-20" />

      case 'date':
        return (
          <div className="flex gap-1.5">
            <Skeleton className="w-5 h-3 rounded-xs" />
            <Skeleton className="w-5 h-3 rounded-xs" />
            <Skeleton className="w-12 h-3 rounded-xs" />
          </div>
        )

      case 'text':
        return <Skeleton className="w-full h-3 rounded-xs" />

      case 'smallText':
        return <Skeleton className="w-14 h-4" />

      case 'doubleText':
        return (
          <>
            <Skeleton className="w-10 h-2 rounded-xs" />
            <Skeleton className="w-20 h-2 rounded-xs mt-1.5" />
          </>
        )

      case 'actions':
        return (
          <div className="flex justify-end">
            <Skeleton className="w-8 h-8" />
          </div>
        )
      case 'number':
        return (
          <div>
            <Skeleton className="w-10 h-4 rounded-xs" />
          </div>
        )
      case 'badge':
        return (
          <div>
            <Skeleton className="w-20 h-5" />
          </div>
        )
      case 'longText':
        return (
          <div>
            <Skeleton className="w-[70%] h-3 rounded-xs" />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {[...Array(totalRows)].map((_, i) => (
        <TableRow key={i}>
          {columns.map((col, index) => (
            <TableCell key={index}>
              {renderSkeleton(col)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
