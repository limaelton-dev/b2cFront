"use client"
import { createContext, useContext, useState } from 'react';

interface CartContextType {
    cartItems: any[];
    itemQty: any[];
    changeQtyItem: (product: any, newV: number) => void;
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType>({
    cartItems: [],
    itemQty: [],
    changeQtyItem: () => {},
    addToCart: () => {},
    removeFromCart: () => {},
});

export const useCart = () => {
    return useContext(CartContext);
};
    
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [itemQty, setItemQty] = useState([]);

    const addToCart = (product) => {
        if(!cartItems.find(p => p.pro_codigo == product.pro_codigo)) {
            setCartItems((prevItems) => [...prevItems, product]);
            setItemQty((prevItems) => [...prevItems, {id: product.pro_codigo, qty: 1}]);
        }
    };

    const removeFromCart = (id) => {
        if(cartItems.find(p => p.pro_codigo == id)) {
            setCartItems((prevItems) => prevItems.filter(item => item.pro_codigo != id));
            setItemQty((prevItems) => prevItems.filter(item => item.id != id));
        }
        console.log(cartItems);
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