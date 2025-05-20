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
import { ProductForm } from "@/components/productos/ProductForm";
import { useProductos } from "@/hooks/useProductos";
import { useCategorias } from "@/hooks/useCategorias";
import { Producto } from "@/types/types"; 
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/productos/ConfirmationModal";

export default function ProductosPage() {
  const {
    productos,
    calcularPrecioVenta,
    actualizarProducto,
    crearProducto,
    desactivarProducto,
    fetchProductos
  } = useProductos();

  const { categoriasPadre, subcategorias, loading } = useCategorias();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [initialProductState, setInitialProductState] = useState<string>("");
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
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

  const filteredSubcategorias = subcategorias.filter(
    (cat) =>
      cat.categoria_padre_id === editingProduct.categoria_id &&
      cat.estado === "A"
  );

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleEditClick = () => {
    const product = productos.find((p) => p.id === selectedProducts[0]);
    if (!product) return toast.error("Producto no encontrado");
    setEditingProduct(product);
    setInitialProductState(JSON.stringify(product));
    setIsFormOpen(true);
  };

  const handleNewProduct = () => {
    const nuevo: Producto = {
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
    };
    setEditingProduct(nuevo);
    setInitialProductState(JSON.stringify(nuevo));
    setSelectedFile(null);
    setSelectedProducts([]);
    setIsFormOpen(true);
  };

  const handleFormChange = (field: keyof Producto, value: any) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }));
  };


  const handleDeleteClick = () => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto para eliminar");
      return;
    }

    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedProducts.map(id => desactivarProducto(id)));
      toast.success(`Se ${selectedProducts.length === 1 ? 'ha eliminado el producto' : 'han eliminado los productos'} exitosamente`);
      setSelectedProducts([]);
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar productos:', error);
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
          <h2 className="text-3xl font-bold mb-4">Gestión de Productos</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNewProduct} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Nuevo Producto
              </Button>
              <Button onClick={handleEditClick} disabled={selectedProducts.length !== 1}>
                <PencilIcon className="mr-2" />
                Editar
              </Button>
              <Button onClick={handleDeleteClick} variant="destructive" className="gap-2">
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
  categorias={categoriasPadre}
  subcategorias={filteredSubcategorias}
  onChange={handleFormChange}
  onFileChange={handleFileChange}
  onSubmit={handleSubmitForm}
  onCancel={() => setIsFormOpen(false)}
  calcularPrecioVenta={calcularPrecioVenta}
/>
        </div>
      </SidebarInset>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title={`¿Está seguro que desea eliminar ${selectedProducts.length} producto(s)?`}
        description={selectedProducts.length === 1 
          ? "Esta acción no se puede deshacer. El producto será eliminado permanentemente."
          : "Esta acción no se puede deshacer. Los productos seleccionados serán eliminados permanentemente."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </SidebarProvider>
  );
}
