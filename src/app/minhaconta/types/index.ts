// Tipos para dados pessoais
export interface DadosPessoaisType {
  nome: string;
  cpf: string;
  email: string;
  username: string;
  dob: string;
  phone: string;
}

// Tipos para endereços
export interface EnderecoType {
  id: number;
  address: string;
  bairro: string;
  city: string;
  state: string;
  cep: string;
  isPrincipal?: boolean;
}

// Tipos para cartões
export interface CartaoType {
  id: number;
  nome: string;
  numero: string;
  validade: string;
  cvv: string;
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