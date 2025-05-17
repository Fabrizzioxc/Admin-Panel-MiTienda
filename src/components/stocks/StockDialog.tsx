
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AjusteStock } from "@/hooks/useStocks";

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ajuste: AjusteStock | null;
  setAjuste: (a: AjusteStock) => void;
  onApply: () => void;
}

export function StockDialog({ open, onOpenChange, ajuste, setAjuste, onApply }: StockDialogProps) {
  if (!ajuste) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ajustar Stock</DialogTitle>
          <DialogDescription>
            Ajuste el stock físico del producto <strong>{ajuste.nombre}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label>Stock Actual</Label>
            <Input value={ajuste.stock_fisico} disabled className="text-right" />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label>Tipo de Ajuste</Label>
            <Select
              value={ajuste.tipo}
              onValueChange={(value: "add" | "subtract") => setAjuste({ ...ajuste, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4 text-green-500" /> Incrementar
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <MinusIcon className="h-4 w-4 text-red-500" /> Reducir
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label>Cantidad</Label>
            <Input
              type="number"
              min="1"
              value={ajuste.cantidad}
              onChange={(e) =>
                setAjuste({
                  ...ajuste,
                  cantidad: Number.parseInt(e.target.value) || 0,
                })
              }
              className="text-right"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label>Stock Nuevo</Label>
            <Input
              value={
                ajuste.tipo === "add"
                  ? ajuste.stock_fisico + ajuste.cantidad
                  : ajuste.stock_fisico - ajuste.cantidad
              }
              disabled
              className="text-right font-medium"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onApply}>Aplicar Ajuste</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
