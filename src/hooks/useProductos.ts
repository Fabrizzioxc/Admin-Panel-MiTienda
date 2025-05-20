// ✅ useProductos.ts final y robusto contra error 22P02 y con paginación
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Producto } from "@/types/types";

// 👉 Hook para uso completo (sin paginación, para formularios, etc.)
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
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const foto_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/${fileName}`;

      const productoLimpio: Partial<Producto> = {
        ...producto,
        foto_url,
      };

      const camposOpcionales: (keyof Producto)[] = ['categoria_id', 'subcategoria_id', 'codigo'];
      camposOpcionales.forEach(key => {
        const valor = productoLimpio[key];
        if (valor === null || valor === undefined || valor === '') {
          delete productoLimpio[key];
        }
      });

      if (!productoLimpio.id) delete productoLimpio.id;

      const { data, error: insertError } = await supabase
        .from("productos")
        .insert([productoLimpio])
        .select();

      if (insertError || !data || data.length === 0) throw insertError;

      const nuevoProducto = data[0];

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

      fetchProductos();
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
    fetchProductos,
    calcularPrecioVenta,
    actualizarProducto,
    crearProducto,
    desactivarProducto,
  };
}

// 👉 Hook independiente para tabla con paginación y filtro por nombre
export function useProductosPaginado() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProductos = async (pageIndex: number, searchTerm: string) => {
    setLoading(true);
    const limit = 10;
    const from = pageIndex * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from('productos')
      .select('*', { count: 'exact' })
      .ilike('nombre', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error al cargar productos:', error);
    } else {
      setProductos(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  return {
    productos,
    total,
    loading,
    fetchProductos,
  };
}
