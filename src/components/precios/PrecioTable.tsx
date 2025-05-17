import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Producto } from "@/hooks/usePrecios";

interface PrecioTableProps {
  productos: Producto[];
  categorias: { id: number; nombre: string }[];
  selectedIds: number[];
  onSearch: (value: string) => void;
  onFilter: (value: string) => void;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: number, checked: boolean) => void;
  searchTerm: string;
  categoriaFilter: string;
}

export function PrecioTable({
  productos,
  categorias,
  selectedIds,
  onSearch,
  onFilter,
  onSelectAll,
  onSelect,
  searchTerm,
  categoriaFilter,
}: PrecioTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={categoriaFilter} onValueChange={onFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    productos.length > 0 &&
                    productos.every((p) => selectedIds.includes(p.id))
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio Actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(producto.id)}
                    onCheckedChange={(checked) =>
                      onSelect(producto.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Avatar className="h-10 w-10 rounded-md">
                    <img
                      src={producto.foto_url || "/placeholder.svg"}
                      alt={producto.nombre}
                    />
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{producto.nombre}</TableCell>
                <TableCell className="text-right">
                  ${producto.precio.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
