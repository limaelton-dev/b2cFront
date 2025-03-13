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