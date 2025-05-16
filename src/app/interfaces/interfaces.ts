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
    addToCart: (product: any, idCor: number) => boolean;
    removeFromCart: (id: string, idCor?: number) => boolean;
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
    name: string,
    email: string,
    username?: string,
    profile_id?: number
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
  productId: number;
  quantity: number;
  price?: number;
  colorId?: number; // Mantido para compatibilidade com o frontend atual
  product?: {
    id: number;
    description: string;
    price: number;
    pro_ativo: boolean;
    imagens?: Array<{
      id: number;
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