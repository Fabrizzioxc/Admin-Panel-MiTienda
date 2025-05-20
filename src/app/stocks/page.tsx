"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StockTable } from '@/components/stocks/StockTable'
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
          <h2 className="text-3xl font-bold mb-4">Gestión de Stock</h2>
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
              <StockTable
                stocks={stocks}
                onEdit={(stock) => abrirDialogo(stock.id, stock.stock_fisico, stock.nombre)}
              />
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