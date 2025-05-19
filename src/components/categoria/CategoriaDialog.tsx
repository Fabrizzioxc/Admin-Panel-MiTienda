import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Categoria } from "@/types/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoria: Categoria) => void;
  categoria: Categoria | null;
  categoriasPadre: Categoria[];
}

export function CategoriaDialog({
  open,
  onOpenChange,
  onSave,
  categoria,
  categoriasPadre,
}: Props) {
  const [formData, setFormData] = useState<Categoria>({
    id: "",
    codigo: "",
    descripcion: "",
    tipo: "C",
    estado: "A",
    imagen_url: "",
    categoria_padre_id: null,
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        ...categoria,
        categoria_padre_id: categoria.categoria_padre_id ?? null,
      });
    } else {
      setFormData({
        id: "",
        codigo: "",
        descripcion: "",
        tipo: "C",
        estado: "A",
        imagen_url: "",
        categoria_padre_id: null,
      });
    }
  }, [categoria]);

  const handleChange = (field: keyof Categoria, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.descripcion.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!formData.codigo?.trim()) {
      const codigoAuto = `C-${Math.random().toString(36).substring(2, 8)}`;
      formData.codigo = codigoAuto.toUpperCase();
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formData.id ? "Editar" : "Nueva"} {formData.tipo === "S" ? "Subcategoría" : "Categoría"}</DialogTitle>
          <DialogDescription>Complete los campos y guarde los cambios.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nombre</Label>
            <Input
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(val) => handleChange("tipo", val)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">Categoría</SelectItem>
                <SelectItem value="S">Subcategoría</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.tipo === "S" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Categoría Padre</Label>
              <Select
                value={formData.categoria_padre_id || ""}
                onValueChange={(val) => handleChange("categoria_padre_id", val)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasPadre.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(val) => handleChange("estado", val)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Activo</SelectItem>
                <SelectItem value="I">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {formData.id ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
