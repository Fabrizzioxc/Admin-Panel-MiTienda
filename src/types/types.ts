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
