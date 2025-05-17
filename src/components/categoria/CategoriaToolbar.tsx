import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function CategoriaToolbar({ onNuevaCategoria, activeTab }: any) {
  return (
    <div className="flex gap-2 ml-auto">
      {(activeTab === "todas" || activeTab === "categorias") && (
        <Button onClick={() => onNuevaCategoria("C")} className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Nueva Categoría
        </Button>
      )}
      {(activeTab === "todas" || activeTab === "subcategorias") && (
        <Button onClick={() => onNuevaCategoria("S")} variant={activeTab === "todas" ? "outline" : "default"} className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Nueva Subcategoría
        </Button>
      )}
    </div>
  );
}
