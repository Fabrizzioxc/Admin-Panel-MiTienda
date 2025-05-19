import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Categoria } from "@/types/types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categorias")
      .select("*") // ✅ Incluye activas e inactivas
      .order("descripcion", { ascending: true });

    if (error) {
      toast.error(`Error al cargar categorías: ${error.message}`);
      console.error("Error en Supabase:", error);
    } else {
      setCategorias(data || []);
    }
    setLoading(false);
  };

  const guardarCategoria = async (categoria: Categoria) => {
    try {
      console.log("Categoría a guardar:", categoria);

      // Asegurarse de que el objeto tenga la estructura correcta
      const categoriaData = {
        id: categoria.id || undefined,
        codigo: categoria.codigo.trim(),
        descripcion: categoria.descripcion.trim(),
        tipo: categoria.tipo,
        estado: categoria.estado,
        imagen_url: categoria.imagen_url || null,
        categoria_padre_id: categoria.categoria_padre_id || null
      };

      const { data, error } = await supabase
        .from("categorias")
        .upsert(categoriaData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No se recibieron datos de la categoría");

      toast.success("Categoría guardada correctamente");
      await fetchCategorias();
      return data;
    } catch (error: any) {
      console.error("Error en Supabase:", error);
      const msg = error?.message || "Error desconocido al guardar la categoría";
      toast.error(`Error al guardar la categoría: ${msg}`);
      return null;
    }
  };

  // ✅ Nueva función para inactivar
  const inactivarCategoria = async (id: string) => {
    const { error } = await supabase
      .from("categorias")
      .update({ estado: "I" })
      .eq("id", id);

    if (error) {
      toast.error("Error al inactivar la categoría");
    } else {
      toast.success("Categoría inactivada");
      await fetchCategorias();
    }
  };

  const categoriasPadre = categorias.filter((c) => c.tipo === "C");
  const subcategorias = categorias.filter((c) => c.tipo === "S");

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    categoriasPadre,
    subcategorias,
    guardarCategoria,
    inactivarCategoria, // ✅ exportada
    fetchCategorias,
    loading,
  };
}
