"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStocks, StockItem } from "@/hooks/useStocks";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, AlertTriangleIcon } from "lucide-react";

export default function StockPage() {
  const { stocks, updateStock, loading } = useStocks();
  const [isOpen, setIsOpen] = useState(false);
  const [stockActual, setStockActual] = useState(0);
  const [nuevoStock, setNuevoStock] = useState(0);
  const [stockId, setStockId] = useState("");
  const [productoNombre, setProductoNombre] = useState("");

  const abrirDialogo = (id: string, actual: number, nombre: string) => {
    setStockId(id);
    setStockActual(actual);
    setNuevoStock(actual);
    setProductoNombre(nombre);
    setIsOpen(true);
  };

  const handleActualizar = async () => {
    await updateStock(stockId, nuevoStock);
    setIsOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Gestión de Stock</h2>
          <div className="rounded-md border">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando stocks...</p>
              </div>
            ) : stocks.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No se encontraron productos en stock</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Stock Físico</TableHead>
                    <TableHead className="text-right">Stock Comprometido</TableHead>
                    <TableHead className="text-right">Disponible</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock: StockItem) => {
                    const disponible = stock.stock_fisico - stock.stock_comprometido;
                    const bajo = disponible <= 0;
                    return (
                      <TableRow key={stock.id}>
                        <TableCell>
                          <div className="relative w-20 h-20">
                            <img
                              src={stock.foto_url || "/placeholder.svg"}
                              alt={stock.nombre}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{stock.nombre}</TableCell>
                        <TableCell>{stock.categoria}</TableCell>
                        <TableCell className="text-right">{stock.stock_fisico}</TableCell>
                        <TableCell className="text-right">{stock.stock_comprometido}</TableCell>
                        <TableCell className="text-right">{disponible}</TableCell>
                        <TableCell className="text-center">
                          {bajo ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangleIcon className="h-3 w-3" /> Bajo
                            </Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => abrirDialogo(stock.id, stock.stock_fisico, stock.nombre)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajustar Stock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Producto</Label>
                  <span>{productoNombre}</span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Stock actual</Label>
                  <Input disabled value={stockActual} className="text-right" />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                <Label>Nuevo stock</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={nuevoStock === 0 ? "" : nuevoStock.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNuevoStock(isNaN(value) ? 0 : value);
                  }}
                  className="text-right"
                />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleActualizar}>Aplicar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}