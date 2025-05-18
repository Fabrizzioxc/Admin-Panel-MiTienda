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

interface ProductTableProps {
  productos: Producto[];
  searchTerm: string;
  selectedProducts: string[];
  onSelect: (id: string) => void;
}

const categoriasData: Categoria[] = [
  { id: "1", nombre: "Smartphones", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "2", nombre: "Laptops", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "3", nombre: "Audio", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "4", nombre: "Tablets", tipo: "S", estado: "A", categoria_padre_id: "" },
  { id: "5", nombre: "Wearables", tipo: "S", estado: "A", categoria_padre_id: "" },
];

export default function ProductosPage() {
  const { productos, calcularPrecioVenta, actualizarProducto, crearProducto, desactivarProducto, fetchProductos } = useProductos();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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
    setSelectedProducts((prev: string[]) =>
      prev.includes(id) ? prev.filter((pid: string) => pid !== id) : [...prev, id]
    );
  };

  const handleEditClick = () => {
    if (selectedProducts.length !== 1) {
      toast.error("Debe seleccionar exactamente un producto para editar");
      return;
    }

    const product = productos.find((p) => p.id === selectedProducts[0]);
    if (!product) return toast.error("Producto no encontrado");

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
    setSelectedProducts([]);
    setIsFormOpen(true);
  };

  const handleFormChange = (field: keyof Producto, value: any) => {
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleDeleteClick = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto para eliminar");
      return;
    }

    const confirm = window.confirm(`¿Está seguro que desea eliminar ${selectedProducts.length} producto(s)?`);
    if (!confirm) return;

    try {
      for (const productId of selectedProducts) {
        await desactivarProducto(productId);
      }
      toast.success("Productos eliminados exitosamente");
      setSelectedProducts([]);
      fetchProductos();
    } catch (error) {
      toast.error("Error al eliminar los productos");
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmitForm = async () => {
    if (editingProduct.id) {
      await actualizarProducto(editingProduct, selectedFile || undefined);
    } else {
      if (!selectedFile) return toast.error("Debes subir una imagen");
      await crearProducto(editingProduct, selectedFile);
    }
    setIsFormOpen(false);
    setSelectedFile(null);
    fetchProductos();
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Gestión de Productos</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNewProduct} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Nuevo Producto
              </Button>
              <Button 
                onClick={handleEditClick}
                disabled={selectedProducts.length !== 1}
              >
                <PencilIcon className="mr-2" />
                Editar
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                className="gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>

          <ProductTable
            productos={productos}
            searchTerm={searchTerm}
            selectedProducts={selectedProducts}
            onSelect={handleSelectProduct}
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