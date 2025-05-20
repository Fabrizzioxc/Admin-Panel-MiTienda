import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, PencilIcon } from "lucide-react";
import { StockItem } from "@/hooks/useStocks";

interface StockTableProps {
  stocks: StockItem[];
  onEdit: (stock: StockItem) => void;
}

export function StockTable({ stocks, onEdit }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Stock Físico</TableHead>
            <TableHead className="text-right">Stock Comprometido</TableHead>
            <TableHead className="text-right">Disponible</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const disponible = stock.stock_fisico - stock.stock_comprometido;
            const bajo = disponible <= 0;
            return (
              <TableRow key={stock.id}>
                <TableCell>
                  <div className="relative w-20 h-20 mx-auto">
                    <img
                      src={stock.foto_url || "/placeholder.svg"}
                      alt={stock.nombre}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </TableCell>
                <TableCell>{stock.nombre}</TableCell>
                <TableCell>{stock.categoria}</TableCell>
                <TableCell className="text-right">{stock.stock_fisico}</TableCell>
                <TableCell className="text-right">{stock.stock_comprometido}</TableCell>
                <TableCell className="text-right">{disponible}</TableCell>
                <TableCell className="text-center">
                  {bajo ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangleIcon className="h-3 w-3" /> Bajo
                    </Badge>
                  ) : (
                    <Badge variant="success">Normal</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(stock)}
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