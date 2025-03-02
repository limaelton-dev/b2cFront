// Tipos para dados pessoais
export interface DadosPessoaisType {
  full_name: string;
  cpf: string;
  email: string;
  username: string;
  birth_date: string;
  phone: string;
  gender: string | null;
  profile_type: string;
}

// Tipos para endereços
export interface EnderecoType {
  id: number;
  profile_id: number;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para cartões
export interface CartaoType {
  id: number;
  profile_id: number;
  card_number: string;
  holder_name: string;
  expiration_date: string;
  is_default: boolean;
  card_type: string;
  last_four_digits: string;
  created_at: string;
  updated_at: string;
}

// Tipos para compras
export interface ProdutoCompraType {
  nome: string;
  valor: string;
  quantidade: number;
  imagem: any;
}

export interface CompraType {
  id: number;
  produtos: ProdutoCompraType[];
  status: 'A caminho' | 'Entregue' | 'Cancelada' | 'Processando';
  data: string;
}

// Tipos para sidebar
export interface SubItemType {
  icon: React.ReactNode;
  label: string;
}

export interface MainItemType {
  icon: React.ReactNode;
  label: string;
  subItems?: SubItemType[];
} 