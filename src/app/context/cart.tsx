"use client"
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr, cartUpdate, getCart } from '../services/produto/page';
import { CartContextType } from '../interfaces/interfaces';
import { useAuth } from './auth';

const CartContext = createContext<CartContextType>({
    cartItems: [],
    cartData: [],
    changeQtyItem: () => {},
    addToCart: () => false,
    removeFromCart: () => {},
});

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    
    return function executedFunction(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export const useCart = () => {
    return useContext(CartContext);
};
    
export const CartProvider = ({ children }) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartData, setCartData] = useState([]);
    const { user } = useAuth();

    const isLoggedIn = user;

    const addToCart = (product) => {
        const itemExists = cartItems.some(item => item.pro_codigo === product.pro_codigo);

        if(itemExists) {
            return false;
        }

        setCartItems((prevItems) => [...prevItems, product]);
        setCartData((prevItems) => [...prevItems, {id: product.pro_codigo, qty: 1}]);
        debouncedSendCartToServer(cartData);
        return true;
    };

    const removeFromCart = (id) => {
        if(cartItems.find(p => p.pro_codigo == id)) {
            setCartItems((prevItems) => prevItems.filter(item => item.pro_codigo != id));
            setCartData((prevItems) => prevItems.filter(item => item.id != id));
        }
    };

    const changeQtyItem = (id, newQty) => {
        const updatedItems = cartData.map((item) => 
            item.id === id ? { ...item, qty: newQty } : item
        );
        setCartData(updatedItems);
    }

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const cart = await getCart(user.id);
                setCartData(cart.data);
                localStorage.setItem('cart', JSON.stringify(cart.data))
                if(cart.data.length > 0) {
                    const resp = await getProdsArr(cart.data.map(i => i.id));
                    if(resp.data) {
                        setCartItems(resp.data); 
                    }
                }
            } catch (error) {
                console.error('Erro: ', error);
            }
        }
        if(isLoggedIn)
            fetchCartData();
    }, [user]);

    const debouncedSendCartToServer = (data) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
            sendCartToServer(data);
        }, 1000);
    };

    const sendCartToServer = (data) => {
        cartUpdate(user.id, data);
    };
      
    useEffect(() => {
        if (cartData.length > 0) {
            if (isLoggedIn) {
                if (JSON.stringify(cartData) !== localStorage.getItem('cart')) {
                    localStorage.setItem('cart', JSON.stringify(cartData));
                    debouncedSendCartToServer(cartData);
                }
            } else {
                Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
            }
        }

    }, [cartData]);

    useEffect(() => {
        const fetchCartData = async (storage) => {
            const data = storage ? localStorage.getItem('cart') : Cookies.get('cart')
            if(data) {
                const cookieCart = JSON.parse(data);
                if (cookieCart.length > 0) {
                    try {
                        const cart = await getProdsArr(cookieCart.map(i => i.id));
                        setCartItems(cart.data);
                        setCartData(cookieCart);
                    } catch (error) {
                        console.error('Erro: ', error);
                    }
                }
            }
        };

        
        if (isLoggedIn) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            fetchCartData(true);
        }
        fetchCartData(false);
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};