export type Categoria = {
  id: string;
  codigo: string;
  tipo: "C" | "S";
  descripcion: string;
  imagen_url?: string;
  estado: "A" | "I";
};
