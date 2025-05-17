import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpIcon, PercentIcon } from "lucide-react";
import { VistaPrevia } from "@/hooks/usePrecios";

interface PrecioFormProps {
  porcentaje: number;
  onChangePorcentaje: (value: number) => void;
  onVistaPrevia: () => void;
  onAplicarCambios: () => void;
  onCancelarVista: () => void;
  showPreview: boolean;
  vistaPrevia: VistaPrevia[];
  productosNombres: (id: number) => string;
  disabled: boolean;
}

export function PrecioForm({
  porcentaje,
  onChangePorcentaje,
  onVistaPrevia,
  onAplicarCambios,
  onCancelarVista,
  showPreview,
  vistaPrevia,
  productosNombres,
  disabled,
}: PrecioFormProps) {
  return (
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
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={porcentaje === 0 ? "" : porcentaje}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              onChangePorcentaje(isNaN(value) || value < 0 ? 0 : value);
            }}
            className="pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      {showPreview && (
        <div className="mt-4 space-y-2 rounded-md border p-4">
          <h3 className="font-medium">Vista previa de cambios</h3>
          <div className="max-h-40 space-y-2 overflow-auto text-sm">
            {vistaPrevia.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{productosNombres(item.id)}</span>
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
      onClick={showPreview ? onAplicarCambios : onVistaPrevia}
      disabled={disabled}
    >
      {showPreview ? "Aplicar Cambios" : "Vista Previa"}
    </Button>
    {showPreview && (
      <Button variant="outline" className="w-full" onClick={onCancelarVista}>
        Cancelar
      </Button>
    )}
  </CardFooter>
</Card>

  );
}
