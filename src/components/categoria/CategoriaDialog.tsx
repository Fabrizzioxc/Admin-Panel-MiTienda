// ✅ CategoriaDialog.tsx actualizado
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function CategoriaDialog({ open, onOpenChange, categoria, onSave, categoriasPadre }: any) {
  const [formData, setFormData] = useState({
    ...categoria,
    estado: categoria?.estado || "A",
    tipo: categoria?.tipo || "C"
  });

  useEffect(() => {
    setFormData({
      ...categoria,
      estado: categoria?.estado || "A",
      tipo: categoria?.tipo || "C"
    });
  }, [categoria]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formData?.id ? "Editar" : "Nueva"} {formData.tipo === "S" ? "Subcategoría" : "Categoría"}</DialogTitle>
          <DialogDescription>Complete los campos y guarde los cambios.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">Nombre</Label>
            <Input id="descripcion" value={formData.descripcion || ""} onChange={(e) => handleChange("descripcion", e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">Tipo</Label>
            <Select value={formData.tipo || "C"} onValueChange={(val) => handleChange("tipo", val)}>
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
                  {categoriasPadre.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.descripcion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Estado</Label>
            <Select value={formData.estado || "A"} onValueChange={(val) => handleChange("estado", val)}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{formData?.id ? "Guardar" : "Crear"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
