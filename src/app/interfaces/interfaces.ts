/*  

    Contexts

*/

export interface AuthContextType {
    user: User;
    setUserFn: (user: User) => void;
}

export interface CartContextType {
    cartItems: any[];
    itemQty: any[];
    changeQtyItem: (product: any, newV: number) => void;
    addToCart: (product: any) => boolean;
    removeFromCart: (id: string) => void;
}

export interface AlertDialogContextType {
    openDialog: (titleDialog: string, msgDialog: string, btnTxtLeft: string, btnTxtRight: string, onConfirm: (value: boolean) => void) => void;
}

/*  

    Outros

*/

export interface User {
    id: number,
    name: string,
    email: string
}