export type Categoria = {
  id?: string;
  descripcion: string;
  tipo: "C" | "S";
  parent_id: string | null;
  estado: "A" | "I";
};
