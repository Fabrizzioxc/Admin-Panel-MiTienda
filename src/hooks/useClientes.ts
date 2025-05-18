import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Cliente } from "@/types/types";

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("email", "fabrizzio@prueba.com"); // puedes cambiarlo por lógica más general

    if (error) {
      console.error("Error al cargar cliente:", error);
    } else {
      setClientes(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading };
};
