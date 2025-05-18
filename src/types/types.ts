export type Categoria = {
  id: string;
  codigo: string;
  tipo: "C" | "S";
  descripcion: string;
  imagen_url: string | null;
  estado: "A" | "I";
  categoria_padre_id: string | null;
};
export type Cliente = {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  celular: string;
  email: string;
  estado: "A" | "I";
  created_at: string;
};

export type Producto = {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion: string;
  unidad_venta: string;
  categoria_id: string | null;
  subcategoria_id: string | null;
  contenido: string | null;
  info_adicional: string | null;
  estado: "A" | "I";
  foto_url: string;
  moneda: string;
  valor_venta: number;
  tasa_impuesto: number;
  precio_venta: number;
  created_at: string;
};
