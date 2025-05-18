// components/precios/PrecioTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Producto } from "@/hooks/usePrecios";

interface PrecioTableProps {
  productos: Producto[];
  selected: string[];
  onToggleSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  categoriaFilter: string;
  onFilter: (categoria: string) => void;
}

export function PrecioTable({
  productos,
  selected,
  onToggleSelect,
  onSelectAll,
  categoriaFilter,
  onFilter,
}: PrecioTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <Select value={categoriaFilter} onValueChange={onFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas las categorías</SelectItem>
            {productos
              .map((p) => ({
                id: p.categoria_id || "0",
                nombre: p.categoria || "Sin categoría",
              }))
              .filter((cat, i, arr) => arr.findIndex((c) => c.id === cat.id) === i)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    productos.length > 0 &&
                    productos.every((p) => selected.includes(p.id))
                  }
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-center">Precio Actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="pl-2">
                  <Checkbox
                    checked={selected.includes(producto.id)}
                    onCheckedChange={(checked) =>
                      onToggleSelect(producto.id, !!checked)
                    }
                    className="h-6 w-6 ml-auto"
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-20 h-20">
                    <img
                      src={producto.foto_url || "/placeholder.svg"}
                      alt={producto.nombre}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {producto.nombre}
                </TableCell>
                <TableCell className="text-center">
                  S/ {producto.precio.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
