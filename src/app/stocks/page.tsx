"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { SearchIcon, FilterIcon, SaveIcon, AlertTriangleIcon, PlusIcon, MinusIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Datos de ejemplo
const stocksData = [
  {
    id: 1,
    producto_id: 1,
    nombre: "Smartphone Galaxy S21",
    categoria_id: 1,
    stock_fisico: 25,
    stock_comprometido: 10,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    producto_id: 2,
    nombre: "Laptop Dell XPS 13",
    categoria_id: 2,
    stock_fisico: 12,
    stock_comprometido: 5,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    producto_id: 3,
    nombre: "Auriculares Sony WH-1000XM4",
    categoria_id: 3,
    stock_fisico: 30,
    stock_comprometido: 15,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    producto_id: 4,
    nombre: "Tablet iPad Pro",
    categoria_id: 4,
    stock_fisico: 8,
    stock_comprometido: 6,
    foto_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    producto_id: 5,
    nombre: "Smartwatch Apple Watch Series 7",
    categoria_id: 5,
    stock_fisico: 15,
    stock_comprometido: 8,
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

export default function StocksPage() {
  const [stocks, setStocks] = useState(stocksData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("0")
  const [editedStocks, setEditedStocks] = useState<{ [key: number]: number }>({})
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [adjustingStock, setAdjustingStock] = useState({
    id: 0,
    nombre: "",
    stock_fisico: 0,
    cantidad: 0,
    tipo: "add" as "add" | "subtract",
  })

  // Filtrar stocks por término de búsqueda y categoría
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === "0" || stock.categoria_id.toString() === categoriaFilter
    return matchesSearch && matchesCategoria
  })

  // Manejar cambio en el stock físico
  const handleStockChange = (id: number, value: number) => {
    setEditedStocks({
      ...editedStocks,
      [id]: value,
    })
  }

  // Guardar cambios de stock
  const handleSaveChanges = () => {
    const updatedStocks = stocks.map((stock) => {
      if (editedStocks[stock.id] !== undefined) {
        return {
          ...stock,
          stock_fisico: editedStocks[stock.id],
        }
      }
      return stock
    })

    setStocks(updatedStocks)
    setEditedStocks({})
    toast.success("Cambios guardados correctamente")
  }

  // Abrir diálogo de ajuste de stock
  const handleOpenAdjustDialog = (stock: (typeof stocksData)[0]) => {
    setAdjustingStock({
      id: stock.id,
      nombre: stock.nombre,
      stock_fisico: stock.stock_fisico,
      cantidad: 0,
      tipo: "add",
    })
    setIsAdjustDialogOpen(true)
  }

  // Aplicar ajuste de stock
  const handleApplyAdjustment = () => {
    if (adjustingStock.cantidad <= 0) {
      toast.error("La cantidad debe ser mayor a 0")
      return
    }

    const updatedStocks = stocks.map((stock) => {
      if (stock.id === adjustingStock.id) {
        const newStock =
          adjustingStock.tipo === "add"
            ? stock.stock_fisico + adjustingStock.cantidad
            : stock.stock_fisico - adjustingStock.cantidad

        if (adjustingStock.tipo === "subtract" && newStock < 0) {
          toast.error("El stock no puede ser negativo")
          return stock
        }

        return {
          ...stock,
          stock_fisico: newStock,
        }
      }
      return stock
    })

    setStocks(updatedStocks)
    setIsAdjustDialogOpen(false)
    toast.success(`Stock ${adjustingStock.tipo === "add" ? "incrementado" : "reducido"} correctamente`)
  }

  // Verificar si hay cambios pendientes
  const hasPendingChanges = Object.keys(editedStocks).length > 0

  // Determinar si un producto tiene stock bajo
  const hasLowStock = (stock_fisico: number, stock_comprometido: number) => {
    return stock_fisico <= stock_comprometido
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            <div className="flex gap-2">
              {hasPendingChanges && (
                <Button onClick={handleSaveChanges} className="gap-1">
                  <SaveIcon className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Stock Físico</TableHead>
                  <TableHead className="text-right">Stock Comprometido</TableHead>
                  <TableHead className="text-right">Disponible</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="w-24 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => {
                  const stockValue = editedStocks[stock.id] !== undefined ? editedStocks[stock.id] : stock.stock_fisico

                  const disponible = stockValue - stock.stock_comprometido
                  const isLowStock = hasLowStock(stockValue, stock.stock_comprometido)

                  return (
                    <TableRow key={stock.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10 rounded-md">
                          <img src={stock.foto_url || "/placeholder.svg"} alt={stock.nombre} />
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{stock.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          value={stockValue}
                          onChange={(e) => handleStockChange(stock.id, Number.parseInt(e.target.value) || 0)}
                          className="h-8 w-20 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">{stock.stock_comprometido}</TableCell>
                      <TableCell className="text-right">{disponible}</TableCell>
                      <TableCell className="text-center">
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangleIcon className="h-3 w-3" />
                            Bajo
                          </Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAdjustDialog(stock)}
                          className="h-8 w-full"
                        >
                          Ajustar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Diálogo para ajustar stock */}
          <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Ajustar Stock</DialogTitle>
                <DialogDescription>Ajuste el stock físico del producto {adjustingStock.nombre}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="stock-actual">Stock Actual</Label>
                  <Input id="stock-actual" value={adjustingStock.stock_fisico} disabled className="text-right" />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="tipo-ajuste">Tipo de Ajuste</Label>
                  <Select
                    value={adjustingStock.tipo}
                    onValueChange={(value: "add" | "subtract") => setAdjustingStock({ ...adjustingStock, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center gap-2">
                          <PlusIcon className="h-4 w-4 text-green-500" />
                          <span>Incrementar</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center gap-2">
                          <MinusIcon className="h-4 w-4 text-destructive" />
                          <span>Reducir</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={adjustingStock.cantidad}
                    onChange={(e) =>
                      setAdjustingStock({
                        ...adjustingStock,
                        cantidad: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-right"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="stock-nuevo">Stock Nuevo</Label>
                  <Input
                    id="stock-nuevo"
                    value={
                      adjustingStock.tipo === "add"
                        ? adjustingStock.stock_fisico + adjustingStock.cantidad
                        : adjustingStock.stock_fisico - adjustingStock.cantidad
                    }
                    disabled
                    className="text-right font-medium"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleApplyAdjustment}>Aplicar Ajuste</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
