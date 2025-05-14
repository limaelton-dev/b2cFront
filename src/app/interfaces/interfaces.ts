/*  

    Contexts

*/

export interface AuthContextType {
    user: User;
    setUserFn: (user: User) => void;
    logout: () => void;
}

export interface CouponContextType {
    statusMessage: string;
    activeCoupon: undefined | boolean;
    coupon: CouponShow;
    setCouponFn: (coupon: CouponShow) => void;
}

export interface CartContextType {
    cartItems: any[];
    cartData: any[];
    changeQtyItem: (product: any, newV: number) => void;
    addToCart: (product: any, idCor: number) => Promise<boolean>;
    removeFromCart: (id: string, idCor?: number) => Promise<boolean>;
    removeItems: () => void;
}

export interface AlertDialogContextType {
    openDialog: (titleDialog: string, msgDialog: string, btnTxtLeft: string, btnTxtRight: string, onConfirm: (value: boolean) => void) => void;
} 

export interface ToastSideContextType {
    showToast: (message: string, type: string) => void;
}

/*  

    Outros

*/

export interface User {
    id: number,
    name?: string,
    email: string,
    username?: string,
    profile_id?: number,
    profileId?: number,
    profileType?: 'PF' | 'PJ',
    profile?: ProfilePF | ProfilePJ,
    address?: Address[],
    phone?: Phone[],
    card?: Card[]
}

export interface ProfilePF {
    id?: number,
    fullName?: string,
    cpf?: string,
    birthDate?: string,
    gender?: string | null
}

export interface ProfilePJ {
    id?: number,
    companyName?: string,
    cnpj?: string,
    tradingName?: string,
    stateRegistration?: string,
    municipalRegistration?: string
}

export interface Address {
    id: number,
    street: string,
    number: string,
    complement?: string,
    neighborhood: string,
    city: string,
    state: string,
    zip_code: string,
    is_default: boolean
}

export interface Phone {
    id: number,
    number: string,
    ddd: string,
    is_default: boolean,
    verified: boolean
}

export interface Card {
    id: number,
    card_number: string,
    holder_name: string,
    expiration_date: string,
    is_default: boolean,
    brand: string
}

export interface CouponShow {
    id: number,
    name: string,
    percent_discount: number,
    prod_category: number,
    exp_date: string,
}

export interface CouponShowAdm {
    id: number,
    name: string,
    percent_discount: number,
    prod_category: number,
    exp_date: Date,
    created_by: User,
    uses: number,
}

// Novas interfaces para o carrinho
export interface CartItemDto {
  produto_id: number;
  quantity: number;
  price?: number;
  colorId?: number; // Mantido para compatibilidade com o frontend atual
  product?: {
    pro_codigo: number;
    pro_descricao: string;
    pro_precovenda: number;
    pro_ativo: boolean;
    imagens?: Array<{
      id: number;
      pro_codigo: number;
      url: string;
    }>;
    // Outros campos do produto que possam existir
  };
}

export interface UpdateCartDto {
  cart_data?: CartItemDto[];
}

export interface CartDataDto {
  cart_data: CartItemDto[];
}

export interface CartTotalDto {
  total: number;
}

export interface AddItemDto {
  produto_id: number;
  quantity: number;
  price?: number;
}

// Interfaces para o novo carrinho
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  subtotal: string;
  total: string;
  items: CartItem[];
}