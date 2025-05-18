import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  categoria_id: string;
  categoria?: string;
  foto_url: string | null;
  estado: string;
};

export type VistaPrevia = {
  id: string;
  precioActual: number;
  precioNuevo: number;
};

export const usePrecios = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("0");
  const [porcentaje, setPorcentaje] = useState(0);
  const [previewData, setPreviewData] = useState<VistaPrevia[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data: productosData, error: productosError } = await supabase
        .from("productos")
        .select("*")
        .order("nombre");

      if (productosError) throw productosError;

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("id, descripcion");

      if (categoriasError) throw categoriasError;

      const productosConCategoria: Producto[] = productosData.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio_venta,
        categoria_id: p.categoria_id || "0",
        categoria:
          categoriasData.find((c) => c.id === p.categoria_id)?.descripcion ||
          "Sin categoría",
        foto_url: p.foto_url,
        estado: p.estado,
      }));

      setProductos(productosConCategoria);
      setFiltered(productosConCategoria);
    } catch (error: any) {
      toast.error(`Error al cargar productos: ${error.message}`);
      console.error("Supabase error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filteredProducts = productos.filter((p) => {
      const matchesText = p.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategoria =
        categoria === "0" || p.categoria_id?.toString() === categoria;
      return matchesText && matchesCategoria;
    });
    setFiltered(filteredProducts);
  }, [productos, searchTerm, categoria]);

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filtered.map((p) => p.id) : []);
  };

  const toggleSelect = (id: string, checked: boolean) => {
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

    const preview = selectedIds
      .map((id) => {
        const producto = productos.find((p) => p.id === id);
        if (!producto) return null;
        const precioNuevo = Number(
          (producto.precio * (1 + porcentaje / 100)).toFixed(2)
        );
        return {
          id,
          precioActual: producto.precio,
          precioNuevo,
        };
      })
      .filter((item): item is VistaPrevia => item !== null);

    setPreviewData(preview);
    setShowPreview(true);
  };

  const aplicarCambios = async () => {
    try {
      for (const id of selectedIds) {
        const producto = productos.find((p) => p.id === id);
        if (!producto) continue;

        const nuevoPrecio = Number(
          (producto.precio * (1 + porcentaje / 100)).toFixed(2)
        );

        const { error } = await supabase
          .from("productos")
          .update({ precio_venta: nuevoPrecio })
          .eq("id", id);

        if (error) throw error;
      }

      toast.success(
        `Precios actualizados para ${selectedIds.length} productos`
      );

      await fetchProductos();
      setSelectedIds([]);
      setPorcentaje(0);
      setShowPreview(false);
    } catch (error: any) {
      toast.error(`Error al actualizar: ${error.message}`);
      console.error("Supabase error:", error);
    }
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
    loading,
  };
};
