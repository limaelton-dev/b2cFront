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
    removeFromCart: () => false,
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
        const updatedCartData = cartData.filter(
            item => !(item.id === id && item.colorId === idCor)
        );
        setCartData(updatedCartData);
    
        const hasOtherItemsWithSameId = updatedCartData.some(item => item.id === id);
        if (!hasOtherItemsWithSameId) {
            setCartItems(cartItems.filter(item => item.pro_codigo !== id));
        }
    
        debouncedSendCartToServer();
    
        return true;
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
                if (cart && cart.data) {
                    if (cart.data.cart_data) {
                        localStorage.setItem('cart', JSON.stringify(cart.data.cart_data));
                        const cartdata = cart.data;
                        if (cartdata.cart_data && cartdata.cart_data.length > 0) {
                            try {
                                const resp = await getProdsArr(cartdata.cart_data.map(i => i.id));
                                if (resp && resp.data && Array.isArray(resp.data)) {
                                    // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                                    const validCartData = cartdata.cart_data.filter(item => 
                                        resp.data.some(product => product.pro_codigo == item.id)
                                    );
                                    
                                    setCartItems(resp.data);
                                    setCartData(validCartData);
                                } else {
                                    console.error('Dados de produtos inválidos recebidos do servidor');
                                    setCartData([]);
                                    setCartItems([]);
                                }
                            } catch (error) {
                                console.error('Erro ao buscar produtos do carrinho:', error);
                                setCartData([]);
                                setCartItems([]);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do carrinho:', error);
                setCartData([]);
                setCartItems([]);
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
            try {
                let data;
                if (storage) {
                    const storedData = localStorage.getItem('cart');
                    if (storedData) {
                        try {
                            data = JSON.parse(storedData);
                        } catch (e) {
                            console.error('Erro ao analisar dados do localStorage:', e);
                            localStorage.removeItem('cart');
                            return;
                        }
                    }
                } else {
                    const cookieData = Cookies.get('cart');
                    if (cookieData) {
                        try {
                            data = JSON.parse(cookieData);
                        } catch (e) {
                            console.error('Erro ao analisar dados do cookie:', e);
                            Cookies.remove('cart');
                            return;
                        }
                    }
                }
                
                if (data && Array.isArray(data) && data.length > 0) {
                    try {
                        const cart = await getProdsArr(data.map(i => i.id));
                        if (cart && cart.data && Array.isArray(cart.data)) {
                            // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                            const validCartData = data.filter(item => 
                                cart.data.some(product => product.pro_codigo == item.id)
                            );
                            
                            setCartData(validCartData);
                            setCartItems(cart.data);
                        } else {
                            // Se não houver dados válidos, limpa o carrinho
                            console.error('Dados de produtos inválidos recebidos do servidor');
                            setCartData([]);
                            setCartItems([]);
                        }
                    } catch (error) {
                        console.error('Erro ao buscar produtos do carrinho:', error);
                        // Em caso de erro, limpa o carrinho para evitar inconsistências
                        setCartData([]);
                        setCartItems([]);
                    }
                }
            } catch (error) {
                console.error('Erro ao processar dados do carrinho:', error);
                setCartData([]);
                setCartItems([]);
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