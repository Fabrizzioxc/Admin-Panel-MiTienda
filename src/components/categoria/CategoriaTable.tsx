import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FolderIcon, TagIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CategoriaTable({ categorias, onEdit }: any) {
  const getParentName = (parentId: string | null) => {
    const parent = categorias.find((c: any) => c.id === parentId);
    return parent ? parent.descripcion : "-";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría Padre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((cat: any) => (
            <TableRow key={cat.id} className={cat.estado === "I" ? "text-red-600" : ""}>
              <TableCell>
                {cat.tipo === "C" ? (
                  <FolderIcon className="h-5 w-5 text-primary" />
                ) : (
                  <TagIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="font-medium">{cat.descripcion}</TableCell>
              <TableCell>
                <Badge variant={cat.tipo === "C" ? "default" : "outline"}>
                  {cat.tipo === "C" ? "Categoría" : "Subcategoría"}
                </Badge>
              </TableCell>
              <TableCell>{getParentName(cat.parent_id)}</TableCell>
              <TableCell>
                <Badge variant={cat.estado === "A" ? "default" : "destructive"}>
                  {cat.estado === "A" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onEdit(cat)} className="h-8 w-8 p-0">
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
