"use client"
import { createContext, useContext, useState } from 'react';

interface CartContextType {
    cartItems: any[];
    itemQty: any[];
    changeQtyItem: (product: any, newV: number) => void;
    addToCart: (product: any) => boolean;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType>({
    cartItems: [],
    itemQty: [],
    changeQtyItem: () => {},
    addToCart: () => false,
    removeFromCart: () => {},
});

export const useCart = () => {
    return useContext(CartContext);
};
    
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [itemQty, setItemQty] = useState([]);

    const addToCart = (product) => {
        const itemExists = cartItems.some(item => item.pro_codigo === product.pro_codigo);

        if(itemExists) {
            return false;
        }

        setCartItems((prevItems) => [...prevItems, product]);
        setItemQty((prevItems) => [...prevItems, {id: product.pro_codigo, qty: 1}]);
        return true;
    };

    const removeFromCart = (id) => {
        if(cartItems.find(p => p.pro_codigo == id)) {
            setCartItems((prevItems) => prevItems.filter(item => item.pro_codigo != id));
            setItemQty((prevItems) => prevItems.filter(item => item.id != id));
        }
    };

    const changeQtyItem = (id, newQty) => {
        const updatedItems = itemQty.map((item) => 
            item.id === id ? { ...item, qty: newQty } : item
        );
        setItemQty(updatedItems);
    }

    return (
        <CartContext.Provider value={{ cartItems, itemQty, changeQtyItem, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};