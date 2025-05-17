// src/app/productos/page.tsx
"use client";

import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/productos/ProductTable";
import { ProductForm, Producto, Categoria } from "@/components/productos/ProductForm";
import { useProductos } from "@/hooks/useProductos";
import { toast } from "sonner";

const categoriasData: Categoria[] = [
  { id: "1", nombre: "Smartphones", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "2", nombre: "Laptops", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "3", nombre: "Audio", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "4", nombre: "Tablets", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "5", nombre: "Wearables", tipo: "S", estado: "A", categoria_padre_id: "" },
];

export default function ProductosPage() {
  const { productos, calcularPrecioVenta, actualizarProducto, crearProducto, desactivarProducto, fetchProductos } = useProductos();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto>({
    id: "",
    nombre: "",
    descripcion: "",
    unidad_venta: "",
    categoria_id: "",
    subcategoria_id: "",
    contenido: "",
    info_adicional: "",
    estado: "A",
    foto_url: "",
    moneda: "PEN",
    valor_venta: 0,
    tasa_impuesto: 0,
    precio_venta: 0,
    created_at: new Date().toISOString(),
  });
  
  const filteredSubcategorias = categoriasData.filter(
    (cat) => cat.tipo === "S" && cat.estado === "A" && cat.categoria_padre_id === editingProduct.categoria_id
  );

  const handleSelectProduct = (id: string) => {
    setSelectedProductId((prev) => (prev === id ? null : id));
  };

  const handleEditClick = () => {
    const product = productos.find((p) => p.id === selectedProductId);
    if (!product) return toast.error("Seleccione un producto");
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct({
      id: "",
      nombre: "",
      descripcion: "",
      unidad_venta: "",
      categoria_id: "",
      subcategoria_id: "",
      contenido: "",
      info_adicional: "",
      estado: "A",
      foto_url: "",
      moneda: "PEN",
      valor_venta: 0,
      tasa_impuesto: 0,
      precio_venta: 0,
      created_at: new Date().toISOString(),
    });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleFormChange = (field: keyof Producto, value: any) => {
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmitForm = async () => {
    if (editingProduct.id) {
      // Actualizar producto existente
      await actualizarProducto(editingProduct, selectedFile || undefined);
    } else {
      // Crear nuevo producto (requiere archivo)
      if (!selectedFile) return toast.error("Debes subir una imagen");
      await crearProducto(editingProduct, selectedFile);
    }
    setIsFormOpen(false);
    setSelectedFile(null);
    fetchProductos();
  };

  const handleDeleteClick = () => {
    if (!selectedProductId) return toast.error("Seleccione un producto");
    desactivarProducto(selectedProductId);
  };

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
            <div className="flex gap-2">
              <Button onClick={handleNewProduct} className="gap-1">
                <PlusIcon className="h-4 w-4" /> Crear
              </Button>
              <Button variant="outline" onClick={handleEditClick} disabled={!selectedProductId} className="gap-1">
                <PencilIcon className="h-4 w-4" /> Modificar
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteClick}
                disabled={!selectedProductId}
                className="gap-1 text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="h-4 w-4" /> Dar de baja
              </Button>
            </div>
          </div>

          <ProductTable
            productos={productos}
            selectedProductId={selectedProductId}
            onSelect={handleSelectProduct}
            searchTerm={searchTerm}
          />

          <ProductForm
            isOpen={isFormOpen}
            producto={editingProduct}
            categorias={categoriasData}
            subcategorias={filteredSubcategorias}
            onChange={handleFormChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmitForm}
            onCancel={() => setIsFormOpen(false)}
            calcularPrecioVenta={calcularPrecioVenta}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
