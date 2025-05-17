// ✅ hooks/useStocks.ts
import { useState } from "react";
import { toast } from "sonner";

export type StockItem = {
  id: number;
  producto_id: number;
  nombre: string;
  categoria_id: number;
  stock_fisico: number;
  stock_comprometido: number;
  foto_url: string;
};

export type AjusteStock = {
  id: number;
  nombre: string;
  stock_fisico: number;
  cantidad: number;
  tipo: "add" | "subtract";
};

export const useStocks = (initialData: StockItem[]) => {
  const [stocks, setStocks] = useState<StockItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("0");
  const [editedStocks, setEditedStocks] = useState<{ [key: number]: number }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ajuste, setAjuste] = useState<AjusteStock | null>(null);

  const filtered = stocks.filter((stock) => {
    const matchText = stock.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoriaFilter === "0" || stock.categoria_id.toString() === categoriaFilter;
    return matchText && matchCat;
  });

  const applyEdits = () => {
    const updated = stocks.map((stock) => {
      if (editedStocks[stock.id] !== undefined) {
        return { ...stock, stock_fisico: editedStocks[stock.id] };
      }
      return stock;
    });
    setStocks(updated);
    setEditedStocks({});
    toast.success("Cambios guardados correctamente");
  };

  const openDialog = (stock: StockItem) => {
    setAjuste({
      id: stock.id,
      nombre: stock.nombre,
      stock_fisico: stock.stock_fisico,
      cantidad: 0,
      tipo: "add",
    });
    setIsDialogOpen(true);
  };

  const applyAjuste = () => {
    if (!ajuste || ajuste.cantidad <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    const updated = stocks.map((s) => {
      if (s.id === ajuste.id) {
        const nuevoStock =
          ajuste.tipo === "add"
            ? s.stock_fisico + ajuste.cantidad
            : s.stock_fisico - ajuste.cantidad;

        if (ajuste.tipo === "subtract" && nuevoStock < 0) {
          toast.error("El stock no puede ser negativo");
          return s;
        }

        return { ...s, stock_fisico: nuevoStock };
      }
      return s;
    });

    setStocks(updated);
    setIsDialogOpen(false);
    toast.success(`Stock ${ajuste.tipo === "add" ? "incrementado" : "reducido"} correctamente`);
  };

  const isLowStock = (fisico: number, comprometido: number) => fisico <= comprometido;
  const hasPending = Object.keys(editedStocks).length > 0;

  return {
    stocks,
    filtered,
    searchTerm,
    categoriaFilter,
    editedStocks,
    isDialogOpen,
    ajuste,
    setSearchTerm,
    setCategoriaFilter,
    setEditedStocks,
    applyEdits,
    openDialog,
    applyAjuste,
    setIsDialogOpen,
    setAjuste,
    isLowStock,
    hasPending,
  };
};
