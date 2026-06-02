import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

interface InventoryPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InventoryPagination({
  page,
  totalPages,
  onPageChange,
}: InventoryPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <Pagination className="justify-end mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              onPageChange(Math.max(page - 1, 1))
            }
            className={
              page === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              onClick={() => onPageChange(p)}
              className="cursor-pointer"
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              onPageChange(
                Math.min(page + 1, totalPages)
              )
            }
            className={
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}