// hooks/useCategorias.ts
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
      .select("*")
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
      const { data, error } = await supabase
        .from("categorias")
        .upsert([categoria])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No se recibieron datos de la categoría");

      toast.success("Categoría guardada correctamente");
      await fetchCategorias(); // Recargar lista
      return data;
    } catch (error: any) {
      console.error("Error en Supabase:", error);
      toast.error(`Error al guardar la categoría: ${error.message}`);
      return null;
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
    fetchCategorias,
    loading,
  };
}
