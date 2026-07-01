export type Categoria =
  | "restaurante"
  | "bar"
  | "padaria"
  | "pizzaria"
  | "hamburgueria"
  | "oriental"
  | "lanchonete";

export interface Local {
  id: number;
  nome: string;
  slug: string;
  categoria: Categoria;
  descricao: string;
  endereco: string;
  bairro: string;
  imagem: string;
  destaque?: boolean;
}
