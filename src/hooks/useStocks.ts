// hooks/useStocks.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export type StockItem = {
  id: string;
  producto_id: string;
  nombre: string;
  categoria: string;
  foto_url: string | null;
  stock_fisico: number;
  stock_comprometido: number;
};

export const useStocks = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stocks")
      .select(`
        id,
        producto_id,
        stock_fisico,
        stock_comprometido,
        productos ( nombre, categoria_id, foto_url ),
        categorias ( id, descripcion )
      `)
      .order("id");

    if (error) {
      toast.error("Error al obtener stocks");
      setLoading(false);
      return;
    }

    const formatted: StockItem[] = data.map((item: any) => ({
      id: item.id,
      producto_id: item.producto_id,
      nombre: item.productos?.nombre || "-",
      categoria: item.categorias?.descripcion || "Sin categoría",
      foto_url: item.productos?.foto_url || null,
      stock_fisico: item.stock_fisico,
      stock_comprometido: item.stock_comprometido,
    }));

    setStocks(formatted);
    setLoading(false);
  };

  const updateStock = async (id: string, nuevoStock: number) => {
    const { error } = await supabase
      .from("stocks")
      .update({ stock_fisico: nuevoStock })
      .eq("id", id);

    if (error) {
      toast.error("Error al actualizar el stock");
    } else {
      toast.success("Stock actualizado");
      fetchStocks();
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return {
    stocks,
    loading,
    fetchStocks,
    updateStock,
  };
};
