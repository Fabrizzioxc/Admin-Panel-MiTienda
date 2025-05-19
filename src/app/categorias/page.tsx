"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriaTable } from "@/components/categoria/CategoriaTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CategoriaDialog } from "@/components/categoria/CategoriaDialog";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "@/types/types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function CategoriasPage() {
  const { categorias, guardarCategoria, fetchCategorias, subcategorias, categoriasPadre } = useCategorias();

  const [activeTab, setActiveTab] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  

  const filteredCategorias = categorias.filter((cat) => {
    if (activeTab === "categorias") return cat.tipo === "C";
    if (activeTab === "subcategorias") return cat.tipo === "S";
    return true; // todas
  });

  const handleEditar = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsDialogOpen(true);
  };

  const handleNuevaCategoria = () => {
    setEditingCategoria(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: Categoria) => {
    await guardarCategoria(data);
    setIsDialogOpen(false);
    fetchCategorias();
  };
  

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
        <Button onClick={handleNuevaCategoria} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="subcategorias">Subcategorías</TabsTrigger>
        </TabsList>
      </Tabs>

      <CategoriaTable
        categorias={filteredCategorias}
        onEdit={handleEditar}
        activeTab={activeTab}
        categoriasPadre={categoriasPadre}
      />


<CategoriaDialog
  open={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  onSave={handleSubmit}
  categoria={editingCategoria}
  categoriasPadre={categoriasPadre}
/>

    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}
