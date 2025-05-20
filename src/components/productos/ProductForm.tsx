'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Producto, Categoria } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  isOpen: boolean;
  producto: Producto;
  categorias: Categoria[];
  subcategorias: Categoria[];
  onChange: (field: keyof Producto, value: any) => void;
  onFileChange: (file: File) => void;
  onSubmit: () => void;
  onCancel: () => void;
  calcularPrecioVenta: (valor: number, tasa: number) => number;
}

export function ProductForm({
  isOpen,
  producto,
  categorias,
  subcategorias,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
  calcularPrecioVenta,
}: ProductFormProps) {
  const [initialState, setInitialState] = useState(JSON.stringify(producto));
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [errores, setErrores] = useState<{ [K in keyof Producto]?: string } & { imagen?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setErrores({});
      setInitialState(JSON.stringify(producto));
    }
  }, [isOpen]);

  const handleSubmitSeguro = () => {
    const nuevosErrores: typeof errores = {};

    if (!producto.nombre) nuevosErrores.nombre = 'Este campo es obligatorio';
    if (!producto.unidad_venta) nuevosErrores.unidad_venta = 'Este campo es obligatorio';
    if (!producto.categoria_id) nuevosErrores.categoria_id = 'Debes seleccionar una categoría';
    if (!producto.subcategoria_id) nuevosErrores.subcategoria_id = 'Debes seleccionar una subcategoría';
    if (!producto.contenido) nuevosErrores.contenido = 'Este campo es obligatorio';
    if (!producto.info_adicional) nuevosErrores.info_adicional = 'Este campo es obligatorio';
    if (!producto.valor_venta || producto.valor_venta <= 0) nuevosErrores.valor_venta = 'Ingrese un valor válido';
    if (producto.tasa_impuesto < 0) nuevosErrores.tasa_impuesto = 'Debe ser 0 o más';
    if (!producto.foto_url) nuevosErrores.imagen = 'Debes subir una imagen';

    const subcat = subcategorias.find((s) => s.id === producto.subcategoria_id);
    if (subcat && subcat.estado === 'I') nuevosErrores.subcategoria_id = 'La subcategoría está inactiva';

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onSubmit();
  };

  const handleAttemptClose = () => {
    const cambios = JSON.stringify(producto) !== initialState;
    if (cambios) setShowConfirmClose(true);
    else onCancel();
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    onCancel();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleAttemptClose(); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{producto.id ? 'Editar producto' : 'Crear nuevo producto'}</DialogTitle>
            <DialogDescription>Complete los detalles del producto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={producto.nombre}
                onChange={(e) => {
                  onChange('nombre', e.target.value);
                  if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: undefined }));
                }}
              />
              {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
            </div>

            {/* Unidad de venta */}
            <div className="flex flex-col gap-1">
              <Label>Unidad de venta</Label>
              <Input
                value={producto.unidad_venta}
                onChange={(e) => {
                  onChange('unidad_venta', e.target.value);
                  if (errores.unidad_venta) setErrores((prev) => ({ ...prev, unidad_venta: undefined }));
                }}
              />
              {errores.unidad_venta && <p className="text-red-500 text-sm">{errores.unidad_venta}</p>}
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-1">
              <Label>Categoría</Label>
              <Select
                value={producto.categoria_id || ''}
                onValueChange={(value) => {
                  onChange('categoria_id', value);
                  onChange('subcategoria_id', '');
                  if (errores.categoria_id) setErrores((prev) => ({ ...prev, categoria_id: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.filter(cat => cat.estado === 'A').map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.descripcion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errores.categoria_id && <p className="text-red-500 text-sm">{errores.categoria_id}</p>}
            </div>

            {/* Subcategoría */}
            <div className="flex flex-col gap-1">
              <Label>Subcategoría</Label>
              <Select
                value={producto.subcategoria_id || ''}
                onValueChange={(value) => {
                  onChange('subcategoria_id', value);
                  if (errores.subcategoria_id) setErrores((prev) => ({ ...prev, subcategoria_id: undefined }));
                }}
                disabled={!producto.categoria_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategorias
                    .filter(sub => sub.categoria_padre_id === producto.categoria_id)
                    .map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.descripcion}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errores.subcategoria_id && <p className="text-red-500 text-sm">{errores.subcategoria_id}</p>}
            </div>

            {/* Contenido */}
            <div className="flex flex-col gap-1">
              <Label>Contenido</Label>
              <Input
                value={producto.contenido || ''}
                onChange={(e) => {
                  onChange('contenido', e.target.value);
                  if (errores.contenido) setErrores((prev) => ({ ...prev, contenido: undefined }));
                }}
              />
              {errores.contenido && <p className="text-red-500 text-sm">{errores.contenido}</p>}
            </div>

            {/* Info adicional */}
            <div className="flex flex-col gap-1">
              <Label>Información adicional</Label>
              <Textarea
                value={producto.info_adicional || ''}
                onChange={(e) => {
                  onChange('info_adicional', e.target.value);
                  if (errores.info_adicional) setErrores((prev) => ({ ...prev, info_adicional: undefined }));
                }}
              />
              {errores.info_adicional && <p className="text-red-500 text-sm">{errores.info_adicional}</p>}
            </div>

            {/* Valores monetarios */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Moneda</Label>
                <Input value={producto.moneda} disabled />
              </div>
              <div>
                <Label>Valor de venta</Label>
                <Input
                  value={producto.valor_venta === 0 ? '' : producto.valor_venta.toString()}
                  onChange={(e) => {
                    const valor = parseFloat(e.target.value) || 0;
                    onChange('valor_venta', valor);
                    const nuevoPrecio = calcularPrecioVenta(valor, producto.tasa_impuesto);
                    onChange('precio_venta', nuevoPrecio);
                    if (errores.valor_venta) setErrores((prev) => ({ ...prev, valor_venta: undefined }));
                  }}
                />
                {errores.valor_venta && <p className="text-red-500 text-sm">{errores.valor_venta}</p>}
              </div>
              <div>
                <Label>Tasa impuesto %</Label>
                <Input
                  value={producto.tasa_impuesto === 0 ? '' : producto.tasa_impuesto.toString()}
                  onChange={(e) => {
                    const tasa = parseFloat(e.target.value) || 0;
                    onChange('tasa_impuesto', tasa);
                    const nuevoPrecio = calcularPrecioVenta(producto.valor_venta, tasa);
                    onChange('precio_venta', nuevoPrecio);
                    if (errores.tasa_impuesto) setErrores((prev) => ({ ...prev, tasa_impuesto: undefined }));
                  }}
                />
                {errores.tasa_impuesto && <p className="text-red-500 text-sm">{errores.tasa_impuesto}</p>}
              </div>
            </div>

            <Label>Precio venta</Label>
            <Input value={producto.precio_venta.toFixed(2)} disabled />

            {/* Imagen */}
            <Label>Imagen</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                  {producto.foto_url ? (
                    <img src={producto.foto_url} alt="Vista previa" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('La imagen no debe superar los 2MB');
                        return;
                      }
                      onFileChange(file);
                      const previewUrl = URL.createObjectURL(file);
                      onChange('foto_url', previewUrl);
                      if (errores.imagen) setErrores((prev) => ({ ...prev, imagen: undefined }));
                    }
                  }}
                />
              </div>
              {errores.imagen && <p className="text-red-500 text-sm">{errores.imagen}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleAttemptClose}>Cancelar</Button>
            <Button onClick={handleSubmitSeguro}>
              {producto.id ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Salir sin guardar?</DialogTitle>
            <DialogDescription>Perderás los cambios si sales ahora.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmClose(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmClose}>Salir sin guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
