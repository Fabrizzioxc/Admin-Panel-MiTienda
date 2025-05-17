"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, PencilIcon, FolderIcon, TagIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

// Datos de ejemplo
const categoriasData = [
  { id: 1, nombre: "Electrónicos", tipo: "C", parent_id: null, estado: "A" },
  { id: 2, nombre: "Smartphones", tipo: "S", parent_id: 1, estado: "A" },
  { id: 3, nombre: "Laptops", tipo: "S", parent_id: 1, estado: "A" },
  { id: 4, nombre: "Ropa", tipo: "C", parent_id: null, estado: "A" },
  { id: 5, nombre: "Camisetas", tipo: "S", parent_id: 4, estado: "A" },
  { id: 6, nombre: "Pantalones", tipo: "S", parent_id: 4, estado: "I" },
  { id: 7, nombre: "Hogar", tipo: "C", parent_id: null, estado: "A" },
  { id: 8, nombre: "Muebles", tipo: "S", parent_id: 7, estado: "A" },
  { id: 9, nombre: "Decoración", tipo: "S", parent_id: 7, estado: "I" },
]

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState(categoriasData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("todas")
  const [editingCategory, setEditingCategory] = useState({
    id: 0,
    nombre: "",
    tipo: "C",
    parent_id: null as number | null,
    estado: "A",
  })

  // Filtrar categorías por término de búsqueda y tipo
  const filteredCategorias = categorias.filter((categoria) => {
    const matchesSearch = categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === "todas") return matchesSearch
    if (activeTab === "categorias") return matchesSearch && categoria.tipo === "C"
    if (activeTab === "subcategorias") return matchesSearch && categoria.tipo === "S"
    return matchesSearch
  })

  // Obtener categorías principales para el select
  const mainCategories = categorias.filter((cat) => cat.tipo === "C")

  // Editar categoría
  const handleEditCategory = (categoria: (typeof categoriasData)[0]) => {
    setEditingCategory(categoria)
    setIsDialogOpen(true)
  }

  // Preparar para crear una nueva categoría
  const handleNewCategory = (tipo: "C" | "S") => {
    setEditingCategory({
      id: 0,
      nombre: "",
      tipo,
      parent_id: tipo === "S" ? mainCategories[0]?.id || null : null,
      estado: "A",
    })
    setIsDialogOpen(true)
  }

  // Guardar cambios
  const handleSaveCategory = () => {
    if (editingCategory.id === 0) {
      // Crear nueva categoría
      const newCategory = {
        ...editingCategory,
        id: Math.max(...categorias.map((c) => c.id)) + 1,
      }
      setCategorias([...categorias, newCategory])
      toast.success("Categoría creada correctamente")
    } else {
      // Actualizar categoría existente
      setCategorias(categorias.map((c) => (c.id === editingCategory.id ? editingCategory : c)))
      toast.success("Categoría actualizada correctamente")
    }
    setIsDialogOpen(false)
  }

  // Obtener nombre de categoría padre
  const getParentName = (parentId: number | null) => {
    if (!parentId) return "-"
    const parent = categorias.find((c) => c.id === parentId)
    return parent ? parent.nombre : "-"
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
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
            <div className="flex gap-2 ml-auto">
                {activeTab === "categorias" && (
                <Button onClick={() => handleNewCategory("C")} className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    Nueva Categoría
                </Button>
                )}
                {activeTab === "subcategorias" && (
                <Button onClick={() => handleNewCategory("S")} className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    Nueva Subcategoría
                </Button>
                )}
                {activeTab === "todas" && (
                <>
                    <Button onClick={() => handleNewCategory("C")} className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    Nueva Categoría
                    </Button>
                    <Button onClick={() => handleNewCategory("S")} variant="outline" className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    Nueva Subcategoría
                    </Button>
                </>
                )}
            </div>
            </div>
            <TabsContent value="todas" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoría Padre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.map((categoria) => (
                      <TableRow key={categoria.id} className={categoria.estado === "I" ? "text-red-600" : ""}>
                        <TableCell>
                          {categoria.tipo === "C" ? (
                            <FolderIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <TagIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{categoria.nombre}</TableCell>
                        <TableCell>
                          <Badge variant={categoria.tipo === "C" ? "default" : "outline"}>
                            {categoria.tipo === "C" ? "Categoría" : "Subcategoría"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getParentName(categoria.parent_id)}</TableCell>
                        <TableCell>
                          <Badge variant={categoria.estado === "A" ? "default" : "destructive"}>
                            {categoria.estado === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(categoria)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="categorias" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.map((categoria) => (
                      <TableRow key={categoria.id} className={categoria.estado === "I" ? "text-red-600" : ""}>
                        <TableCell>
                          <FolderIcon className="h-5 w-5 text-primary" />
                        </TableCell>
                        <TableCell className="font-medium">{categoria.nombre}</TableCell>
                        <TableCell>
                          <Badge variant={categoria.estado === "A" ? "default" : "destructive"}>
                            {categoria.estado === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(categoria)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="subcategorias" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría Padre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.map((categoria) => (
                      <TableRow key={categoria.id} className={categoria.estado === "I" ? "text-red-600" : ""}>
                        <TableCell>
                          <TagIcon className="h-5 w-5 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="font-medium">{categoria.nombre}</TableCell>
                        <TableCell>{getParentName(categoria.parent_id)}</TableCell>
                        <TableCell>
                          <Badge variant={categoria.estado === "A" ? "default" : "destructive"}>
                            {categoria.estado === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(categoria)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Diálogo para crear/editar categoría */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory.id === 0
                    ? `Nueva ${editingCategory.tipo === "C" ? "Categoría" : "Subcategoría"}`
                    : `Editar ${editingCategory.tipo === "C" ? "Categoría" : "Subcategoría"}`}
                </DialogTitle>
                <DialogDescription>Complete los detalles y guarde los cambios.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={editingCategory.nombre}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nombre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={editingCategory.tipo}
                    onValueChange={(value: "C" | "S") => {
                      setEditingCategory({
                        ...editingCategory,
                        tipo: value,
                        parent_id: value === "S" ? mainCategories[0]?.id || null : null,
                      })
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">Categoría</SelectItem>
                      <SelectItem value="S">Subcategoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingCategory.tipo === "S" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parent_id" className="text-right">
                      Categoría Padre
                    </Label>
                    <Select
                      value={editingCategory.parent_id?.toString() || ""}
                      onValueChange={(value) =>
                        setEditingCategory({
                          ...editingCategory,
                          parent_id: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar categoría padre" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    defaultValue={editingCategory.tipo}
                    onValueChange={(value: "C" | "S") => {
                      setEditingCategory({
                        ...editingCategory,
                        tipo: value,
                        parent_id: value === "S" ? mainCategories[0]?.id || null : null,
                      })
                    }}
                  >
                    <SelectTrigger id="tipo" className="w-full">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">Categoría</SelectItem>
                      <SelectItem value="S">Subcategoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    defaultValue={editingCategory.estado}
                    onValueChange={(value: "A" | "I") => {
                      setEditingCategory({
                        ...editingCategory,
                        estado: value,
                      })
                    }}
                  >
                    <SelectTrigger id="estado" className="w-full">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Activo</SelectItem>
                      <SelectItem value="I">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCategory}>{editingCategory.id === 0 ? "Crear" : "Guardar cambios"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
