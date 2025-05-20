"use client";

import { usePrecios } from "@/hooks/usePrecios";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SearchIcon, FilterIcon } from "lucide-react";
import { PrecioTable } from "@/components/precios/PrecioTable";
import { Categoria } from "@/types/types";

export default function PreciosPage() {
  const {
    productos,
    filtered,
    selectedIds,
    searchTerm,
    categoria,
    porcentaje,
    previewData,
    showPreview,
    setSearchTerm,
    setCategoria,
    setPorcentaje,
    selectAll,
    toggleSelect,
    previewCambios,
    aplicarCambios,
    setShowPreview,
    loading,
  } = usePrecios();

  const categorias: Categoria[] = Array.from(
    new Map(productos.map((p) => [p.categoria_id, p.categoria])).entries()
  )
    .filter(([id, nombre]) => id && nombre)
    .map(([id, nombre]) => ({
      id: id || "0",
      descripcion: nombre || "Sin categoría",
    }));

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          {/* Título */}
          <h2 className="text-xl font-semibold mb-4">Gestión de Precios</h2>

          {/* Buscador y filtro */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* 🔍 Buscador */}
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 🔽 Filtro de categorías */}
            <div className="w-full sm:w-auto">
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-full sm:w-auto">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todas las categorías</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.descripcion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de precios */}
          <div className="rounded-lg border">
            <PrecioTable productos={filtered} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
