// components/stocks/StockTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, PencilIcon } from "lucide-react";
import { StockItem } from "@/hooks/useStocks";

interface StockTableProps {
  items: StockItem[];
  edited: { [key: string]: number };
  setEdited: (map: { [key: string]: number }) => void;
  onEdit: (item: StockItem) => void;
  isLow: (fisico: number, comprometido: number) => boolean;
}

export function StockTable({ items, edited, setEdited, onEdit, isLow }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Stock Físico</TableHead>
            <TableHead className="text-right">Stock Comprometido</TableHead>
            <TableHead className="text-right">Disponible</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="w-12 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const value = edited[item.id] ?? item.stock_fisico;
            const disponible = value - item.stock_comprometido;
            const bajo = isLow(value, item.stock_comprometido);

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Avatar className="h-10 w-10 rounded-md">
                    <img src={item.foto_url || "/placeholder.svg"} alt={item.nombre} />
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{item.nombre}</TableCell>
                <TableCell className="text-right">{value}</TableCell>
                <TableCell className="text-right">{item.stock_comprometido}</TableCell>
                <TableCell className="text-right">{disponible}</TableCell>
                <TableCell className="text-center">
                  {bajo ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangleIcon className="h-3 w-3" /> Bajo
                    </Badge>
                  ) : (
                    <Badge variant="outline">A</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Ajustar stock</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}