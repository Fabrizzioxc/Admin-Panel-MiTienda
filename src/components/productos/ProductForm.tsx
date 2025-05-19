'use client';

import { ChangeEvent } from "react";
import { Producto, Categoria } from "@/types/types"; // ✅ Importamos Producto desde types
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  isOpen: boolean;
  producto: Producto;
  categorias: Categoria[];
  subcategorias: Categoria[];
  onChange: (field: keyof Producto, value: any) => void;
  onFileChange: (file: File) => void;
  onSubmit: () => void;
  onCancel: () => void;
  calcularPrecioVenta: (valor: number, tasa: number) => number;
}

export function ProductForm({
  isOpen,
  producto,
  categorias,
  subcategorias,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
  calcularPrecioVenta,
}: ProductFormProps) {

  const handleSubmitSeguro = () => {
    if (!producto.categoria_id) {
      toast.error("Debes seleccionar una categoría.");
      return;
    }
  
    const subcat = subcategorias.find((s) => s.id === producto.subcategoria_id);
    if (subcat && subcat.estado === "I") {
      toast.warning("La subcategoría seleccionada está inactiva y no puede usarse.");
      return;
    }
  
    onSubmit();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{producto.id ? "Editar producto" : "Crear nuevo producto"}</DialogTitle>
          <DialogDescription>Complete los detalles del producto.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4">
          {/* Nombre y unidad de venta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={producto.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="unidad_venta">Unidad de Venta</Label>
              <Input
                id="unidad_venta"
                value={producto.unidad_venta}
                onChange={(e) => onChange("unidad_venta", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={producto.descripcion}
              onChange={(e) => onChange("descripcion", e.target.value)}
              required
            />
          </div>

          {/* Categoría y Subcategoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Categoría</Label>
              <Select
                value={producto.categoria_id || ""}
                onValueChange={(value) => {
                  onChange("categoria_id", value);
                  onChange("subcategoria_id", ""); // resetea subcategoría
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                {categorias.filter((cat) => cat.estado === "A").map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Subcategoría</Label>
              <Select
                value={producto.subcategoria_id || ""}
                onValueChange={(value) => onChange("subcategoria_id", value)}
                disabled={!producto.categoria_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategorias
                    .filter((subcat) => subcat.categoria_padre_id === producto.categoria_id)
                    .map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.descripcion}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contenido e info adicional */}
          <Label>Contenido</Label>
          <Input
            value={producto.contenido || ""}
            onChange={(e) => onChange("contenido", e.target.value)}
          />

          <Label>Información adicional</Label>
          <Textarea
            value={producto.info_adicional || ""}
            onChange={(e) => onChange("info_adicional", e.target.value)}
          />

          {/* Valores numéricos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Moneda</Label>
              <Input value={producto.moneda} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Valor de venta</Label>
              <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={producto.valor_venta === 0 ? "" : producto.valor_venta.toString()}
              onChange={(e) => {
                const valor = parseFloat(e.target.value) || 0;
                onChange("valor_venta", valor);
                const nuevoPrecio = calcularPrecioVenta(valor, producto.tasa_impuesto);
                onChange("precio_venta", nuevoPrecio);
              }}
            />

            </div>
            <div className="flex flex-col gap-2">
              <Label>Tasa de impuesto (%)</Label>
              <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={producto.tasa_impuesto === 0 ? "" : producto.tasa_impuesto.toString()}
              onChange={(e) => {
                const tasa = parseFloat(e.target.value) || 0;
                onChange("tasa_impuesto", tasa);
                const nuevoPrecio = calcularPrecioVenta(producto.valor_venta, tasa);
                onChange("precio_venta", nuevoPrecio);
              }}
            />
            </div>
          </div>

          <Label>Precio venta</Label>
          <Input value={producto.precio_venta.toFixed(2)} disabled />

          {/* Estado */}
          <Label>Estado</Label>
          <Select
            value={producto.estado}
            onValueChange={(value) => onChange("estado", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Activo</SelectItem>
              <SelectItem value="I">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          {/* Imagen */}
          <Label>Imagen</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-md border">
                <img
                  src={producto.foto_url || "/placeholder.svg"}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onFileChange(file);
                    const previewUrl = URL.createObjectURL(file);
                    onChange("foto_url", previewUrl);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleSubmitSeguro}>{producto.id ? "Guardar cambios" : "Crear"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
