// src/hooks/useProductos.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export type Producto = {
  id: string;                   
  nombre: string;
  descripcion: string;
  unidad_venta: string;
  categoria_id: string;
  subcategoria_id: string | null;
  contenido: string | null;
  info_adicional: string | null;
  estado: "A" | "I";
  foto_url: string;
  moneda: string;
  valor_venta: number;
  tasa_impuesto: number;
  precio_venta: number;
  created_at: string;
};

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*");
    if (error) toast.error("Error cargando productos");
    else setProductos(data as Producto[]);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const calcularPrecioVenta = (valor: number, tasa: number) => {
    return valor * (1 + tasa / 100);
  };

  const actualizarProducto = async (producto: Producto, file?: File) => {
    let imageUrl = producto.foto_url;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("productos").upload(fileName, file);
      if (error) {
        toast.error("Error subiendo imagen");
        return;
      }
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${fileName}`;
    }
    const { error } = await supabase
      .from("productos")
      .update({ ...producto, foto_url: imageUrl })
      .eq("id", producto.id);
    if (error) toast.error("Error al actualizar producto");
    else {
      toast.success("Producto actualizado");
      fetchProductos();
    }
  };

  const crearProducto = async (producto: Producto, file: File) => {
    if (!file) {
      toast.error("Debes subir una imagen");
      return;
    }
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("productos").upload(fileName, file);
    if (uploadError) {
      toast.error("Error subiendo imagen");
      return;
    }
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${fileName}`;
    const { error } = await supabase
      .from("productos")
      .insert([{ ...producto, foto_url: imageUrl }]);
    if (error) toast.error("Error al insertar producto");
    else {
      toast.success("Producto creado");
      fetchProductos();
    }
  };

  const desactivarProducto = async (id: string) => {
    const { error } = await supabase
      .from("productos")
      .update({ estado: "I" })
      .eq("id", id);
    if (error) toast.error("Error al dar de baja");
    else {
      toast.success("Producto inactivado");
      fetchProductos();
    }
  };

  return {
    productos,
    calcularPrecioVenta,
    actualizarProducto,
    crearProducto,
    desactivarProducto,
    fetchProductos,
  };
}
