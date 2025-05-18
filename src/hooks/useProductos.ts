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
    // 1. Subir la imagen
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("productos")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const foto_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${fileName}`;

    // 2. Preparar producto sin campos vacíos inválidos
    const productoLimpio: Partial<Producto> = {
      ...producto,
      foto_url,
    };

    // Limpiar campos opcionales
    const camposOpcionales: (keyof Producto)[] = ['categoria_id', 'subcategoria_id', 'codigo'];
    camposOpcionales.forEach(key => {
      const valor = productoLimpio[key];
      if (valor === null || valor === undefined || valor === '') {
        delete productoLimpio[key];
      }
    });

    // Si no hay id, es un nuevo producto
    if (!productoLimpio.id) delete productoLimpio.id;

    // 3. Insertar producto
    const { data, error: insertError } = await supabase
      .from("productos")
      .insert([productoLimpio])
      .select();

    if (insertError || !data || data.length === 0) throw insertError;

    const nuevoProducto = data[0];

    // 4. Crear su stock con valor inicial 0
    const { error: stockError } = await supabase
      .from("stocks")
      .insert({
        producto_id: nuevoProducto.id,
        stock_fisico: 0,
        stock_comprometido: 0,
      });

    if (stockError) {
      console.error("❌ Error creando el stock:", stockError);
      toast.warning("Producto creado, pero no se pudo registrar en stock.");
    } else {
      toast.success("Producto y stock creados exitosamente.");
    }
  } catch (error) {
    console.error("❌ Supabase insert error", error);
    toast.error("Error al crear el producto.");
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
