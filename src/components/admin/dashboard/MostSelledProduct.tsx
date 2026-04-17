'use client'

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MostSelledProduct() {

  return (
    <div className="col-span-8 h-68 p-4 rounded-lg border border-muted shadow-xs">
      <p className="text-lg font-semibold">Productos más vendidos</p>
      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Vendido</TableHead>
              <TableHead className="text-end">Ganancia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
