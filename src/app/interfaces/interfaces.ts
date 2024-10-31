/*  

    Contexts

*/

export interface AuthContextType {
    user: User;
    setUserFn: (user: User) => void;
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
    removeFromCart: (id: string, idCor: number) => void;
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
    email: string
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