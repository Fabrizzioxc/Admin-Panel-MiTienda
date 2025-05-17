// ✅ Hook personalizado: hooks/usePrecios.ts
import { useState } from "react";
import { toast } from "sonner";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  foto_url: string;
};

export type VistaPrevia = {
  id: number;
  precioActual: number;
  precioNuevo: number;
};

export const usePrecios = (productosBase: Producto[]) => {
  const [productos, setProductos] = useState(productosBase);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("0");
  const [porcentaje, setPorcentaje] = useState(0);
  const [previewData, setPreviewData] = useState<VistaPrevia[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const filtered = productos.filter((p) => {
    const matchesText = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoria === "0" || p.categoria_id.toString() === categoria;
    return matchesText && matchesCategoria;
  });

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filtered.map((p) => p.id) : []);
  };

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const previewCambios = () => {
    if (selectedIds.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }
    if (porcentaje <= 0) {
      toast.error("El porcentaje debe ser mayor a 0");
      return;
    }
    const preview = selectedIds.map((id) => {
      const producto = productos.find((p) => p.id === id)!;
      const precioNuevo = producto.precio * (1 + porcentaje / 100);
      return { id, precioActual: producto.precio, precioNuevo };
    });
    setPreviewData(preview);
    setShowPreview(true);
  };

  const aplicarCambios = () => {
    const actualizados = productos.map((p) =>
      selectedIds.includes(p.id)
        ? { ...p, precio: p.precio * (1 + porcentaje / 100) }
        : p
    );
    setProductos(actualizados);
    setSelectedIds([]);
    setPorcentaje(0);
    setShowPreview(false);
    toast.success(`Precios actualizados para ${selectedIds.length} productos`);
  };

  return {
    productos,
    filtered,
    selectedIds,
    searchTerm,
    categoria,
    porcentaje,
    previewData,
    showPreview,
    setSearchTerm,
    setCategoria,
    setPorcentaje,
    selectAll,
    toggleSelect,
    previewCambios,
    aplicarCambios,
    setShowPreview,
  };
};
