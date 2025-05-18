// ✅ useProductos.ts final y robusto contra error 22P02
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Producto } from "@/types/types";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from("productos").select("*");
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
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(fileName, file);

      if (uploadError) {
        toast.error("Error subiendo imagen: " + uploadError.message);
        return;
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${fileName}`;

      // Construye un nuevo objeto manualmente
const payload: Partial<Producto> = {
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  unidad_venta: producto.unidad_venta,
  categoria_id: producto.categoria_id === "" ? null : producto.categoria_id,
  subcategoria_id: producto.subcategoria_id === "" ? null : producto.subcategoria_id,
  contenido: producto.contenido,
  info_adicional: producto.info_adicional,
  estado: producto.estado,
  foto_url: imageUrl,
  moneda: producto.moneda,
  valor_venta: producto.valor_venta,
  tasa_impuesto: producto.tasa_impuesto,
  precio_venta: producto.precio_venta,
  // id y codigo se omiten completamente
};


      const { error } = await supabase.from("productos").insert([payload]);

      if (error) {
        toast.error("Error al insertar producto: " + error.message);
        console.error("❌ Supabase insert error", error);
        return;
      }

      toast.success("Producto creado");
      fetchProductos();
    } catch (err) {
      console.error("🧨 Error inesperado al crear producto:", err);
      toast.error("Error inesperado al crear producto");
    }
  };

  const desactivarProducto = async (id: string) => {
    const { error } = await supabase.from("productos").update({ estado: "I" }).eq("id", id);
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
