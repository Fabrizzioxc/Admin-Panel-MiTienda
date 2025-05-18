export type Categoria = {
  id: string;
  codigo: string;
  tipo: "C" | "S";
  descripcion: string;
  imagen_url: string | null;
  estado: "A" | "I";
  categoria_padre_id: string | null;
};
