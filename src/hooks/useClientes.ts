import { useEffect, useState } from "react";
import { clientesData } from "@/components/clientes/data";

export type Cliente = {
  id: number;
  nombre: string;
  email: string;
  celular: string;
  estado: string;
  fecha_registro: string;
  avatar?: string;
};

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Cliente>("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Reemplazar por Supabase más adelante
    setClientes(clientesData);
  }, []);

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.celular.includes(searchTerm)
  );

  const sortedClientes = [...filteredClientes].sort((a, b) => {
  const aValue = a[sortField] ?? "";
  const bValue = b[sortField] ?? "";

  return sortDirection === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
    ? 1
    : -1;
});

  const handleSort = (field: keyof Cliente) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return {
    clientes: sortedClientes,
    total: clientes.length,
    searchTerm,
    setSearchTerm,
    handleSort,
    sortField,
  };
};
