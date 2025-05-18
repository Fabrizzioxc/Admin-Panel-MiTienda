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
import {
  MailIcon,
  MoreVerticalIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Cliente } from "@/types/types";
import { ClienteModal } from "./ClienteModal";
import { useState } from "react";

interface ClienteTableProps {
  clientes: Cliente[];
}

export function ClienteTable({ clientes }: ClienteTableProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const handleViewProfile = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  return (
    <div className="mt-6 rounded-md border">
      <ClienteModal
        cliente={selectedCliente}
        isOpen={selectedCliente !== null}
        onClose={() => setSelectedCliente(null)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" />
            <TableHead className="px-4 text-left">Nombre</TableHead>
            <TableHead className="px-4 text-center">Email</TableHead>
            <TableHead className="px-4 text-center">Celular</TableHead>
            <TableHead className="px-4 text-center">Fecha de Creación</TableHead>
            <TableHead className="px-4 text-center">Estado</TableHead>
            <TableHead className="w-12 text-center" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="w-12" />
              <TableCell className="px-4 text-left font-medium">
                {`${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno}`}
              </TableCell>
              <TableCell className="px-4 text-center">{cliente.email}</TableCell>
              <TableCell className="px-4 text-center">{cliente.celular}</TableCell>
              <TableCell className="px-4 text-center">{formatDate(cliente.created_at)}</TableCell>
              <TableCell className="px-4 text-center">
                <Badge variant={cliente.estado === "A" ? "outline" : "secondary"}>
                  {cliente.estado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => handleViewProfile(cliente)}
                    >
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
