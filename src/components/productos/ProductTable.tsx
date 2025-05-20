import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Producto } from "@/types/types";
import { Badge } from "@/components/ui/badge";

interface ProductTableProps {
  productos: Producto[];
  searchTerm: string;
  selectedProducts: string[];
  onSelect: (id: string, all?: boolean) => void;
}

export function ProductTable({ productos, searchTerm, selectedProducts, onSelect }: ProductTableProps) {
  const filtered = React.useMemo(() => productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  ), [productos, searchTerm]);

  const data = filtered;

  const columns: ColumnDef<Producto>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              table.getFilteredRowModel().rows.forEach(row => onSelect(row.original.id, true));
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProducts.includes(row.original.id)}
          onCheckedChange={() => onSelect(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "foto_url",
      header: () => <div className="text-left">Imagen</div>,
      cell: ({ row }) => (
        <div className="relative w-20 h-20">
          <img src={row.original.foto_url} alt="producto" className="w-full h-full object-cover rounded-lg" />
        </div>
      ),
    },
    {
      accessorKey: "nombre",
      header: () => "Nombre",
    },
    {
      accessorKey: "descripcion",
      header: () => "Descripción",
    },
    {
      accessorKey: "precio_venta",
      header: () => <div className="text-right">Precio</div>,
      cell: ({ row }) => <div className="text-right">{row.original.precio_venta.toFixed(2)}</div>,
    },
    {
      accessorKey: "moneda",
      header: () => <div className="text-center">Moneda</div>,
      cell: ({ row }) => <div className="text-center">{row.original.moneda}</div>,
    },
    {
      accessorKey: "unidad_venta",
      header: () => "Unidad",
    },
    {
      accessorKey: "estado",
      header: () => <div className="text-center">Estado</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant={row.original.estado === "I" ? "destructive" : "default"}>
            {row.original.estado === "I" ? "Inactivo" : "Activo"}
          </Badge>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection: {},
    },
  });

  return (
    <div className="mt-6 rounded-md border">
      {filtered.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">No se encontraron productos.</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-sm text-muted-foreground">
              Mostrando {table.getState().pagination.pageIndex * 10 + 1}–
              {Math.min((table.getState().pagination.pageIndex + 1) * 10, filtered.length)} de {filtered.length} productos
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
