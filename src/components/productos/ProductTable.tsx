// ProductTable.tsx corregido
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Producto } from "@/hooks/useProductos";

interface ProductTableProps {
  productos: Producto[];
  searchTerm: string;
  selectedProducts: string[];
  onSelect: (id: string) => void;
}

export function ProductTable({ productos, searchTerm, selectedProducts, onSelect }: ProductTableProps) {
  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead>Unidad de Venta</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((producto) => (
            <TableRow
              key={producto.id}
              className={producto.estado === "I" ? "bg-muted text-muted-foreground font-bold" : ""}
            >
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(producto.id)}
                  onCheckedChange={() => onSelect(producto.id)}
                />
              </TableCell>
              <TableCell>
                <Avatar className="h-10 w-10 rounded-md">
                  <img src={producto.foto_url || "/placeholder.svg"} alt={producto.nombre} />
                </Avatar>
              </TableCell>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.descripcion}</TableCell>
              <TableCell className="text-right">{producto.precio_venta.toFixed(2)}</TableCell>
              <TableCell>{producto.moneda}</TableCell>
              <TableCell>{producto.unidad_venta}</TableCell>
              <TableCell className="text-center">
                <Badge variant={producto.estado === "I" ? "destructive" : "default"}>
                  {producto.estado === "I" ? "Inactivo" : "Activo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
