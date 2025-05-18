"use client";

import { usePrecios } from "@/hooks/usePrecios";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { PrecioTable } from "@/components/precios/PrecioTable";
import { PrecioForm } from "@/components/precios/PrecioForm";

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

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Mostrando {filtered.length} de {productos.length} productos
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <PrecioTable
                productos={filtered}
                selected={selectedIds} // ✅ corregido
                onToggleSelect={toggleSelect}
                onSelectAll={selectAll}
                categoriaFilter={categoria}
                onFilter={setCategoria}
              />
            </div>
            <div>
              <PrecioForm
                porcentaje={porcentaje}
                onChangePorcentaje={setPorcentaje}
                onVistaPrevia={previewCambios}
                onAplicarCambios={aplicarCambios}
                onCancelarVista={() => setShowPreview(false)}
                showPreview={showPreview}
                vistaPrevia={previewData}
                productosNombres={(id) => productos.find((p) => p.id === id)?.nombre || "-"}
                disabled={selectedIds.length === 0 || porcentaje <= 0 || loading}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
