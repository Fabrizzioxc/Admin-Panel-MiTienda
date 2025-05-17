"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

// Datos de ejemplo
const productosData = [
  {
    id: 1,
    nombre: "Smartphone Galaxy S21",
    descripcion: "Smartphone de alta gama con cámara de 108MP",
    precio: 799.99,
    categoria_id: 1,
    estado: "A",
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "Laptop Dell XPS 13",
    descripcion: "Laptop ultradelgada con pantalla InfinityEdge",
    precio: 1299.99,
    categoria_id: 2,
    estado: "A",
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Auriculares Sony WH-1000XM4",
    descripcion: "Auriculares con cancelación de ruido",
    precio: 349.99,
    categoria_id: 3,
    estado: "I",
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Tablet iPad Pro",
    descripcion: "Tablet con chip M1 y pantalla Liquid Retina XDR",
    precio: 999.99,
    categoria_id: 4,
    estado: "A",
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nombre: "Smartwatch Apple Watch Series 7",
    descripcion: "Reloj inteligente con pantalla siempre activa",
    precio: 399.99,
    categoria_id: 5,
    estado: "I",
    foto_url: "/placeholder.svg?height=40&width=40",
  },
]

// Datos de categorías para el select
const categoriasData = [
  { id: 1, nombre: "Smartphones" },
  { id: 2, nombre: "Laptops" },
  { id: 3, nombre: "Audio" },
  { id: 4, nombre: "Tablets" },
  { id: 5, nombre: "Wearables" },
]

export default function ProductosPage() {
  const [productos, setProductos] = useState(productosData)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria_id: 1,
    estado: "A",
    foto_url: "",
  })

  // Filtrar productos por término de búsqueda
  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Seleccionar un producto
  const handleSelectProduct = (id: number) => {
    if (selectedProductId === id) {
      setSelectedProductId(null)
    } else {
      setSelectedProductId(id)
    }
  }

  // Abrir diálogo de edición
  const handleEditClick = () => {
    if (!selectedProductId) {
      toast.error("Debe seleccionar un producto para editar")
      return
    }

    const productToEdit = productos.find((p) => p.id === selectedProductId)
    if (productToEdit) {
      setEditingProduct(productToEdit)
      setIsEditDialogOpen(true)
    }
  }

  // Guardar cambios de edición
  const handleSaveEdit = () => {
    setProductos(productos.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
    setIsEditDialogOpen(false)
    setSelectedProductId(null)
    toast.success("Producto actualizado correctamente")
  }

  // Abrir diálogo de eliminación
  const handleDeleteClick = () => {
    if (!selectedProductId) {
      toast.error("Debe seleccionar un producto para dar de baja")
      return
    }
    setIsDeleteDialogOpen(true)
  }

  // Dar de baja un producto
  const handleDeactivateProduct = () => {
    setProductos(productos.map((p) => (p.id === selectedProductId ? { ...p, estado: "I" } : p)))
    setIsDeleteDialogOpen(false)
    setSelectedProductId(null)
    toast.success("Producto dado de baja correctamente")
  }

  // Crear un nuevo producto
  const handleCreateProduct = () => {
    const newProduct = {
      id: Math.max(...productos.map((p) => p.id)) + 1,
      nombre: editingProduct.nombre,
      descripcion: editingProduct.descripcion,
      precio: editingProduct.precio,
      categoria_id: editingProduct.categoria_id,
      estado: "A",
      foto_url: editingProduct.foto_url || "/placeholder.svg?height=40&width=40",
    }

    setProductos([...productos, newProduct])
    setIsEditDialogOpen(false)
    toast.success("Producto creado correctamente")
  }

  // Preparar para crear un nuevo producto
  const handleNewProduct = () => {
    setEditingProduct({
      id: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      categoria_id: 1,
      estado: "A",
      foto_url: "/placeholder.svg?height=40&width=40",
    })
    setIsEditDialogOpen(true)
  }

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
                <PlusIcon className="h-4 w-4" />
                Crear
              </Button>
              <Button variant="outline" onClick={handleEditClick} disabled={!selectedProductId} className="gap-1">
                <PencilIcon className="h-4 w-4" />
                Modificar
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteClick}
                disabled={!selectedProductId}
                className="gap-1 text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="h-4 w-4" />
                Dar de baja
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id} className={producto.estado === "I" ? "text-destructive" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProductId === producto.id}
                        onCheckedChange={() => handleSelectProduct(producto.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md">
                        <img src={producto.foto_url || "/placeholder.svg"} alt={producto.nombre} />
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate">{producto.descripcion}</TableCell>
                    <TableCell>${producto.precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={producto.estado === "A" ? "outline" : "destructive"}>
                        {producto.estado === "A" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Diálogo para crear/editar producto */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingProduct.id === 0 ? "Crear nuevo producto" : "Editar producto"}</DialogTitle>
                <DialogDescription>Complete los detalles del producto y guarde los cambios.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={editingProduct.nombre}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={editingProduct.descripcion}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={editingProduct.precio}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, precio: Number.parseFloat(e.target.value) })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoría
                  </Label>
                  <Select
                    value={editingProduct.categoria_id.toString()}
                    onValueChange={(value) =>
                      setEditingProduct({ ...editingProduct, categoria_id: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasData.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estado" className="text-right">
                    Estado
                  </Label>
                  <Select
                    value={editingProduct.estado}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, estado: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Activo</SelectItem>
                      <SelectItem value="I">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="foto_url" className="text-right">
                    URL de imagen
                  </Label>
                  <Input
                    id="foto_url"
                    value={editingProduct.foto_url}
                    onChange={(e) => setEditingProduct({ ...editingProduct, foto_url: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingProduct.id === 0 ? handleCreateProduct : handleSaveEdit}>
                  {editingProduct.id === 0 ? "Crear" : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Diálogo de confirmación para dar de baja */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción dará de baja el producto seleccionado. El producto pasará a estado Inactivo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivateProduct}
                  className="bg-destructive text-destructive-foreground"
                >
                  Dar de baja
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
