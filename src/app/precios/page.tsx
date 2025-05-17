"use client";

import { usePrecios } from "@/hooks/usePrecios";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PrecioTable } from "@/components/precios/PrecioTable";
import { PrecioForm } from "@/components/precios/PrecioForm";

// Datos de ejemplo (mock)
const productosData = [
  { id: 1, nombre: "Smartphone Galaxy S21", precio: 799.99, categoria_id: 1, foto_url: "/placeholder.svg" },
  { id: 2, nombre: "Laptop Dell XPS 13", precio: 1299.99, categoria_id: 2, foto_url: "/placeholder.svg" },
  { id: 3, nombre: "Auriculares Sony WH-1000XM4", precio: 349.99, categoria_id: 3, foto_url: "/placeholder.svg" },
  { id: 4, nombre: "Tablet iPad Pro", precio: 999.99, categoria_id: 4, foto_url: "/placeholder.svg" },
  { id: 5, nombre: "Smartwatch Apple Watch Series 7", precio: 399.99, categoria_id: 5, foto_url: "/placeholder.svg" },
];

const categoriasData = [
  { id: 0, nombre: "Todas las categorías" },
  { id: 1, nombre: "Smartphones" },
  { id: 2, nombre: "Laptops" },
  { id: 3, nombre: "Audio" },
  { id: 4, nombre: "Tablets" },
  { id: 5, nombre: "Wearables" },
];

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
  } = usePrecios(productosData);

  const getNombreProducto = (id: number) =>
    productos.find((p) => p.id === id)?.nombre || "Producto";

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 gap-6 md:grid md:grid-cols-3">
          <div className="md:col-span-2">
            <PrecioTable
              productos={filtered}
              categorias={categoriasData}
              selectedIds={selectedIds}
              onSearch={setSearchTerm}
              onFilter={setCategoria}
              onSelectAll={selectAll}
              onSelect={toggleSelect}
              searchTerm={searchTerm}
              categoriaFilter={categoria}
            />
          </div>
          <div className="col-span-1">
            <PrecioForm
              porcentaje={porcentaje}
              onChangePorcentaje={setPorcentaje}
              onVistaPrevia={previewCambios}
              onAplicarCambios={aplicarCambios}
              onCancelarVista={() => setShowPreview(false)}
              showPreview={showPreview}
              vistaPrevia={previewData}
              productosNombres={getNombreProducto}
              disabled={selectedIds.length === 0 || porcentaje <= 0}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
