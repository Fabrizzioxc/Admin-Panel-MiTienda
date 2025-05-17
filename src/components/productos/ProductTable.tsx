// src/components/ProductTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Producto } from "@/hooks/useProductos";

interface ProductTableProps {
  productos: Producto[];
  selectedProductId: string | null;
  onSelect: (id: string) => void;
  searchTerm: string;
}

export function ProductTable({ productos, selectedProductId, onSelect, searchTerm }: ProductTableProps) {
  const filteredProductos = productos.filter((producto) =>
    producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProductos.map((producto) => (
            <TableRow key={producto.id} className={producto.estado === "I" ? "text-destructive" : ""}>
              <TableCell>
                <Checkbox
                  checked={selectedProductId === producto.id}
                  onCheckedChange={() => onSelect(producto.id)}
                />
              </TableCell>
              <TableCell>
                <Avatar className="h-10 w-10 rounded-md">
                  <img src={producto.foto_url || "/placeholder.svg"} alt={producto.descripcion} />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{producto.nombre}</TableCell>
              <TableCell className="max-w-xs truncate">{producto.descripcion}</TableCell>
              <TableCell>${producto.precio_venta.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={producto.estado === "A" ? "outline" : "destructive"}>
                  {producto.estado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
