import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Cliente } from "@/types/types";
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

interface ClienteModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClienteModal({ cliente, isOpen, onClose }: ClienteModalProps) {
  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">{`${cliente.nombres} ${cliente.apellido_paterno} ${cliente.apellido_materno}`}</span>
            <Badge variant={cliente.estado === "A" ? "outline" : "secondary"}>
              {cliente.estado === "A" ? "Activo" : "Inactivo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Email</p>
            <p className="text-sm leading-none text-muted-foreground">
              {cliente.email}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Celular</p>
            <p className="text-sm leading-none text-muted-foreground">
              {cliente.celular}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Fecha de Creación</p>
            <p className="text-sm leading-none text-muted-foreground">
              {formatDate(cliente.created_at)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
