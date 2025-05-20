
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Producto } from "@/types/types";

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
      {filtered.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No se encontraron productos.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-[150px]">Nombre</TableHead>
              <TableHead className="w-[200px]">Descripción</TableHead>
              <TableHead className="w-[120px] text-right">Precio</TableHead>
              <TableHead className="w-[80px] text-center">Moneda</TableHead>
              <TableHead className="w-[120px]">Unidad de Venta</TableHead>
              <TableHead className="w-[100px] text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((producto) => (
              <TableRow
                key={producto.id}
                className={producto.estado === "I" ? "bg-muted text-muted-foreground font-bold" : ""}
              >
                <TableCell className="pl-2">
                  <Checkbox
                    checked={selectedProducts.includes(producto.id)}
                    onCheckedChange={() => onSelect(producto.id)}
                    className="h-6 w-6 ml-auto"
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-20 h-20">
                    <img
                      src={producto.foto_url || ""}
                      alt={producto.nombre}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{producto.nombre}</TableCell>
                <TableCell className="whitespace-normal">{producto.descripcion}</TableCell>
                <TableCell className="text-right pr-4">{producto.precio_venta.toFixed(2)}</TableCell>
                <TableCell className="text-center">{producto.moneda}</TableCell>
                <TableCell className="whitespace-nowrap">{producto.unidad_venta}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={producto.estado === "I" ? "destructive" : "default"} 
                    className="px-3 py-1 text-sm"
                  >
                    {producto.estado === "I" ? "Inactivo" : "Activo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
