import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowUpDownIcon,
  MailIcon,
  MoreVerticalIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Cliente } from "@/hooks/useClientes";

interface ClienteTableProps {
  clientes: Cliente[];
  onSort: (field: keyof Cliente) => void;
  sortField: keyof Cliente;
}

export function ClienteTable({ clientes, onSort, sortField }: ClienteTableProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  return (
    <div className="mt-6 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" />
            <TableHead>
              <SortHeader
                label="Nombre"
                field="nombre"
                sortField={sortField}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortHeader
                label="Email"
                field="email"
                sortField={sortField}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>Celular</TableHead>
            <TableHead>
              <SortHeader
                label="Fecha de Registro"
                field="fecha_registro"
                sortField={sortField}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortHeader
                label="Estado"
                field="estado"
                sortField={sortField}
                onSort={onSort}
              />
            </TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>
                <Avatar className="h-10 w-10 rounded-full">
                  <img
                    src={cliente.avatar || "/placeholder.svg"}
                    alt={cliente.nombre}
                  />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.celular}</TableCell>
              <TableCell>{formatDate(cliente.fecha_registro)}</TableCell>
              <TableCell>
                <Badge variant={cliente.estado === "Activo" ? "outline" : "secondary"}>
                  {cliente.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Ver perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      Enviar email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Llamar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SortHeader({
  label,
  field,
  sortField,
  onSort,
}: {
  label: string;
  field: keyof Cliente;
  sortField: keyof Cliente;
  onSort: (field: keyof Cliente) => void;
}) {
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-1 p-0 hover:bg-transparent"
      onClick={() => onSort(field)}
    >
      <span>{label}</span>
      <ArrowUpDownIcon className="h-4 w-4" />
    </Button>
  );
}
