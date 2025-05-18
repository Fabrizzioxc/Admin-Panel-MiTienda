"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoriaTable } from "@/components/categoria/CategoriaTable";
import { CategoriaDialog } from "@/components/categoria/CategoriaDialog";
import { CategoriaToolbar } from "@/components/categoria/CategoriaToolbar";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "../../types/types";


export default function CategoriasPage() {
  const {
    categorias,
    fetchCategorias,
    guardarCategoria,
    categoriasPadre,
  } = useCategorias();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

const handleNuevaCategoria = (tipo: "C" | "S") => {
  const nueva: Categoria = {
    id: crypto.randomUUID(),
    codigo: tipo === "C" ? `C-${crypto.randomUUID().slice(0, 8)}` : `S-${crypto.randomUUID().slice(0, 8)}`,
    descripcion: "",
    tipo,
    estado: "A",
  };
  setEditingCategoria(nueva);
  setDialogOpen(true);
};

const handleEditar = (categoria: Categoria) => {
  setEditingCategoria(categoria);
  setDialogOpen(true);
};

const filteredCategorias = categorias.filter((cat: Categoria) => {
  const matchSearch = cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
  if (activeTab === "todas") return matchSearch;
  if (activeTab === "categorias") return matchSearch && cat.tipo === "C";
  if (activeTab === "subcategorias") return matchSearch && cat.tipo === "S";
  return matchSearch;
});

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <TabsList>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="categorias">Categorías</TabsTrigger>
                  <TabsTrigger value="subcategorias">Subcategorías</TabsTrigger>
                </TabsList>
                <div className="relative w-full sm:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar categorías..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CategoriaToolbar onNuevaCategoria={handleNuevaCategoria} activeTab={activeTab} />
            </div>
            <TabsContent value={activeTab} className="mt-6">
              <CategoriaTable categorias={filteredCategorias} onEdit={handleEditar} />
            </TabsContent>
          </Tabs>

          <CategoriaDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            categoria={editingCategoria}
            onSave={guardarCategoria}
            categoriasPadre={categoriasPadre}
          />

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
