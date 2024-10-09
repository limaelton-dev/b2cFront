"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr } from '../services/produto/page';
import { CartContextType } from '../interfaces/interfaces';
import { useAuth } from './auth';

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
    const { user } = useAuth();

    const isLoggedIn = user;

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

    useEffect(() => {
        const fetchCartData = async () => {
            const cartData = JSON.parse(localStorage.getItem('cart'));
            if (cartData.length > 0) {
                try {
                    const cart = await getProdsArr(cartData.map(i => i.id));
                    setCartItems(cart.data);
                    setItemQty(cartData);
                } catch (error) {
                    console.error('Erro ao buscar os produtos do carrinho:', error);
                }
            }
        }
        fetchCartData();
    }, [user]);

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem('cart', JSON.stringify(itemQty));
        } else {
            Cookies.set('cart', JSON.stringify(itemQty), { expires: 7 });
        }
    }, [itemQty]);

    useEffect(() => {
        const fetchCartData = async () => {
            if(Cookies.get('cart')) {
                const cookieCart = JSON.parse(Cookies.get('cart'));
                if (cookieCart.length > 0) {
                    try {
                        const cart = await getProdsArr(cookieCart.map(i => i.id));
                        setCartItems(cart.data);
                        setItemQty(cookieCart);
                    } catch (error) {
                        console.error('Erro ao buscar os produtos do carrinho:', error);
                    }
                }
            }
        };
      
        fetchCartData();
    }, []);
    

    return (
        <CartContext.Provider value={{ cartItems, itemQty, changeQtyItem, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};