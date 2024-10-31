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
    const [cartItems, setCartItems] = useState([]); // Produtos
    const [cartData, setCartData] = useState([]); // Quantidade, Cor
    const { user } = useAuth();

    const isLoggedIn = user;

    const addToCart = (product, idCor) => {
        const itemExists = cartItems.some(item => item.pro_codigo === product.pro_codigo && item.colorId == idCor);

        if(itemExists) {
            return false;
        }

        setCartData((prevItems) => {
            if (!Array.isArray(prevItems)) {
                return [{ id: product.pro_codigo, qty: 1, colorId: idCor }];
            }
            return [...prevItems, { id: product.pro_codigo, idCart: prevItems.length + 1, qty: 1, colorId: idCor }];
        });
        setCartItems((prevItems) => [...prevItems, product]);
        debouncedSendCartToServer();
        return true;
    };

    const removeFromCart = (id, idCor) => {
        const itemExists = cartItems.find(p => p.pro_codigo === id);
        setCartData([]);setCartItems([]);
        debouncedSendCartToServer();
        // if (itemExists) {
        //     setCartData(cartData.filter(item => 
        //         item.id !== id || item.colorId === idCor
        //     ));
        //     setCartItems(cartItems.filter(item => item.pro_codigo !== id));
        // }
    };

    const changeQtyItem = (id, newQty) => {
        const updatedItems = cartData.map((item) => 
            item.id === id ? { ...item, qty: newQty } : item
        );
        setCartData(updatedItems);
    }

    useEffect(() => {
        const fetchCartData = async () => {
            console.log('entrou aqui')
            try {
                const cart = await getCart(user.id);
                localStorage.setItem('cart', JSON.stringify(cart.data))
                if(cart.data && cart.data.length > 0) {
                    const resp = await getProdsArr(cart.data.map(i => i.id));
                    if(resp.data) {
                        setCartItems(resp.data); 
                        setCartData(cart.data);
                    }
                }
            } catch (error) {
                console.error('Erro: ', error);
            }
        }
        if(isLoggedIn)
            fetchCartData();
    }, [user]);

    const debouncedSendCartToServer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
            sendCartToServer();
        }, 1000);
    };

    const sendCartToServer = () => {
        if(user) {
            cartUpdate(user.id, cartData);
        }
    };
      
    useEffect(() => {
        if (cartData.length > 0) {
            if (isLoggedIn) {
                if (JSON.stringify(cartData) !== localStorage.getItem('cart')) {
                    localStorage.setItem('cart', JSON.stringify(cartData));
                }
            } else {
                Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
            }
        }
        debouncedSendCartToServer();

    }, [cartData]);

    useEffect(() => {
        const fetchCartData = async (storage) => {
            console.log('entrou aqui uééé´´e')
            const data = storage ? localStorage.getItem('cart') : Cookies.get('cart')
            if(data) {
                const cookieCart = JSON.parse(data);
                if (cookieCart.length > 0) {
                    try {
                        const cart = await getProdsArr(cookieCart.map(i => i.id));
                        setCartData(cookieCart);
                        setCartItems(cart.data);
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