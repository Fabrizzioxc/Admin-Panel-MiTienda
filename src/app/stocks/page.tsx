
"use client";

import { useStocks } from "@/hooks/useStocks";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StockTable } from "@/components/stocks/StockTable";
import { StockDialog } from "@/components/stocks/StockDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterIcon, SaveIcon, SearchIcon } from "lucide-react";

const mockData = [
  { id: 1, producto_id: 1, nombre: "Smartphone Galaxy S21", categoria_id: 1, stock_fisico: 25, stock_comprometido: 10, foto_url: "/placeholder.svg" },
  { id: 2, producto_id: 2, nombre: "Laptop Dell XPS 13", categoria_id: 2, stock_fisico: 12, stock_comprometido: 5, foto_url: "/placeholder.svg" },
  { id: 3, producto_id: 3, nombre: "Auriculares Sony WH-1000XM4", categoria_id: 3, stock_fisico: 30, stock_comprometido: 15, foto_url: "/placeholder.svg" },
  { id: 4, producto_id: 4, nombre: "Tablet iPad Pro", categoria_id: 4, stock_fisico: 8, stock_comprometido: 6, foto_url: "/placeholder.svg" },
  { id: 5, producto_id: 5, nombre: "Smartwatch Apple Watch Series 7", categoria_id: 5, stock_fisico: 15, stock_comprometido: 8, foto_url: "/placeholder.svg" },
];

const categorias = [
  { id: 0, nombre: "Todas las categorías" },
  { id: 1, nombre: "Smartphones" },
  { id: 2, nombre: "Laptops" },
  { id: 3, nombre: "Audio" },
  { id: 4, nombre: "Tablets" },
  { id: 5, nombre: "Wearables" },
];

export default function StocksPage() {
  const {
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
  } = useStocks(mockData);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasPending && (
              <Button onClick={applyEdits} className="gap-1">
                <SaveIcon className="h-4 w-4" /> Guardar Cambios
              </Button>
            )}
          </div>

          <StockTable
            items={filtered}
            edited={editedStocks}
            setEdited={setEditedStocks}
            onEdit={openDialog}
            isLow={isLowStock}
          />

          <StockDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            ajuste={ajuste}
            setAjuste={setAjuste}
            onApply={applyAjuste}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
