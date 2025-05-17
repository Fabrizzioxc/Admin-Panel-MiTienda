import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Categoria } from "@/types/types";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("descripcion", { ascending: true });

    if (error) {
      toast.error("Error al obtener categorías");
    } else {
      setCategorias(data as Categoria[]);
    }
  };

  const guardarCategoria = async (categoria: Categoria) => {
    const isNueva = !categoria.id;
    const { error } = isNueva
      ? await supabase.from("categorias").insert([categoria])
      : await supabase.from("categorias").update(categoria).eq("id", categoria.id!);

    if (error) {
      toast.error("Error al guardar categoría");
    } else {
      toast.success(isNueva ? "Categoría creada" : "Categoría actualizada");
      fetchCategorias();
    }
  };

  const categoriasPadre = categorias.filter((c) => c.tipo === "C");

  return { categorias, fetchCategorias, guardarCategoria, categoriasPadre };
};
