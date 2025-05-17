"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { PercentIcon, SearchIcon, ArrowUpIcon, FilterIcon } from "lucide-react"
import { toast } from "sonner"

// Datos de ejemplo
const productosData = [
  {
    id: 1,
    nombre: "Smartphone Galaxy S21",
    precio: 799.99,
    categoria_id: 1,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "Laptop Dell XPS 13",
    precio: 1299.99,
    categoria_id: 2,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Auriculares Sony WH-1000XM4",
    precio: 349.99,
    categoria_id: 3,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Tablet iPad Pro",
    precio: 999.99,
    categoria_id: 4,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nombre: "Smartwatch Apple Watch Series 7",
    precio: 399.99,
    categoria_id: 5,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
]

// Datos de categorías para el filtro
const categoriasData = [
  { id: 0, nombre: "Todas las categorías" },
  { id: 1, nombre: "Smartphones" },
  { id: 2, nombre: "Laptops" },
  { id: 3, nombre: "Audio" },
  { id: 4, nombre: "Tablets" },
  { id: 5, nombre: "Wearables" },
]

export default function PreciosPage() {
  const [productos, setProductos] = useState(productosData)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("0")
  const [porcentajeIncremento, setPorcentajeIncremento] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<{ id: number; precioActual: number; precioNuevo: number }[]>([])

  // Filtrar productos por término de búsqueda y categoría
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === "0" || producto.categoria_id.toString() === categoriaFilter
    return matchesSearch && matchesCategoria
  })

  // Seleccionar todos los productos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(filteredProductos.map((p) => p.id))
    } else {
      setSelectedProductIds([])
    }
  }

  // Seleccionar un producto
  const handleSelectProduct = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, id])
    } else {
      setSelectedProductIds(selectedProductIds.filter((productId) => productId !== id))
    }
  }

  // Generar vista previa de los cambios
  const handlePreview = () => {
    if (selectedProductIds.length === 0) {
      toast.error("Debe seleccionar al menos un producto")
      return
    }

    if (porcentajeIncremento <= 0) {
      toast.error("El porcentaje de incremento debe ser mayor a 0")
      return
    }

    const preview = selectedProductIds.map((id) => {
      const producto = productos.find((p) => p.id === id)!
      const precioActual = producto.precio
      const precioNuevo = precioActual * (1 + porcentajeIncremento / 100)
      return { id, precioActual, precioNuevo }
    })

    setPreviewData(preview)
    setShowPreview(true)
  }

  // Aplicar cambios de precios
  const handleApplyChanges = () => {
    const updatedProductos = productos.map((producto) => {
      if (selectedProductIds.includes(producto.id)) {
        return {
          ...producto,
          precio: producto.precio * (1 + porcentajeIncremento / 100),
        }
      }
      return producto
    })

    setProductos(updatedProductos)
    setShowPreview(false)
    setSelectedProductIds([])
    setPorcentajeIncremento(0)
    toast.success(`Precios actualizados para ${selectedProductIds.length} productos`)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Selección de Productos</CardTitle>
                <CardDescription>
                  Seleccione los productos a los que desea aplicar el incremento de precio
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                  <div className="flex items-center gap-2">
                    <FilterIcon className="h-4 w-4 text-muted-foreground" />
                    <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por categoría" />
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
                </div>

                <div className="mt-4 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              filteredProductos.length > 0 &&
                              filteredProductos.every((p) => selectedProductIds.includes(p.id))
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Precio Actual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProductos.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedProductIds.includes(producto.id)}
                              onCheckedChange={(checked) => handleSelectProduct(producto.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar className="h-10 w-10 rounded-md">
                              <img src={producto.foto_url || "/placeholder.svg"} alt={producto.nombre} />
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">{producto.nombre}</TableCell>
                          <TableCell className="text-right">${producto.precio.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">{selectedProductIds.length} productos seleccionados</div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incremento de Precios</CardTitle>
                <CardDescription>Defina el porcentaje de incremento a aplicar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="porcentaje">Porcentaje de incremento</Label>
                    <div className="relative">
                      <PercentIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="porcentaje"
                        type="number"
                        min="0"
                        step="0.1"
                        value={porcentajeIncremento}
                        onChange={(e) => setPorcentajeIncremento(Number.parseFloat(e.target.value) || 0)}
                        className="pr-8"
                      />
                    </div>
                  </div>

                  {showPreview && (
                    <div className="mt-4 space-y-2 rounded-md border p-4">
                      <h3 className="font-medium">Vista previa de cambios</h3>
                      <div className="max-h-40 space-y-2 overflow-auto">
                        {previewData.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span>{productos.find((p) => p.id === item.id)?.nombre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">${item.precioActual.toFixed(2)}</span>
                              <ArrowUpIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium text-primary">${item.precioNuevo.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={showPreview ? handleApplyChanges : handlePreview}
                  disabled={selectedProductIds.length === 0 || porcentajeIncremento <= 0}
                >
                  {showPreview ? "Aplicar Cambios" : "Vista Previa"}
                </Button>
                {showPreview && (
                  <Button variant="outline" className="w-full" onClick={() => setShowPreview(false)}>
                    Cancelar
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
