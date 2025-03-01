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
    const [previousLoginState, setPreviousLoginState] = useState(false);

    const isLoggedIn = !!user && !!user.id;

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

    // Função para carregar o carrinho do servidor
    const loadServerCart = async () => {
        try {
            const cart = await getCart();
            if (cart && cart.data) {
                if (cart.data.cart_data) {
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
                                localStorage.setItem('cart', JSON.stringify(validCartData));
                                return true;
                            }
                        } catch (error) {
                            console.error('Erro ao buscar produtos do carrinho:', error);
                        }
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Erro ao buscar dados do carrinho:', error);
            return false;
        }
    };

    // Função para carregar o carrinho local
    const loadLocalCart = async () => {
        try {
            let data;
            const storedData = localStorage.getItem('cart');
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (e) {
                    console.error('Erro ao analisar dados do localStorage:', e);
                    localStorage.removeItem('cart');
                    return false;
                }
            } else {
                const cookieData = Cookies.get('cart');
                if (cookieData) {
                    try {
                        data = JSON.parse(cookieData);
                    } catch (e) {
                        console.error('Erro ao analisar dados do cookie:', e);
                        Cookies.remove('cart');
                        return false;
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
                        return true;
                    }
                } catch (error) {
                    console.error('Erro ao buscar produtos do carrinho:', error);
                }
            }
            return false;
        } catch (error) {
            console.error('Erro ao processar dados do carrinho:', error);
            return false;
        }
    };

    // Efeito para sincronizar o carrinho quando o estado de login muda
    useEffect(() => {
        const syncCart = async () => {
            // Se o usuário acabou de fazer login
            if (isLoggedIn && !previousLoginState) {
                // Verifica se há um carrinho local
                const hasLocalCart = await loadLocalCart();
                
                // Se houver um carrinho local com produtos, atualiza o carrinho do servidor
                if (hasLocalCart && cartData.length > 0) {
                    await cartUpdate(cartData);
                } else {
                    // Se não houver um carrinho local ou estiver vazio, carrega o carrinho do servidor
                    await loadServerCart();
                }
            } else if (isLoggedIn) {
                // Se o usuário já estava logado, apenas carrega o carrinho do servidor
                await loadServerCart();
            } else {
                // Se o usuário está deslogado, carrega o carrinho local
                await loadLocalCart();
            }
            
            // Atualiza o estado anterior de login
            setPreviousLoginState(isLoggedIn);
        };
        
        syncCart();
    }, [isLoggedIn]);

    const debouncedSendCartToServer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
            sendCartToServer();
        }, 1000);
    };

    const sendCartToServer = () => {
        // Sempre salva no localStorage/cookies
        if (cartData.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartData));
            Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
        } else {
            localStorage.removeItem('cart');
            Cookies.remove('cart');
        }
        
        // Se estiver logado, também envia para o servidor
        if (isLoggedIn) {
            cartUpdate(cartData);
        }
    };
      
    useEffect(() => {
        debouncedSendCartToServer();
    }, [cartData]);

    // Carrega o carrinho inicial
    useEffect(() => {
        const loadInitialCart = async () => {
            if (isLoggedIn) {
                // Se o usuário estiver logado, tenta carregar o carrinho do servidor
                const serverCartLoaded = await loadServerCart();
                
                // Se não conseguir carregar do servidor ou o carrinho estiver vazio, tenta carregar do local
                if (!serverCartLoaded || cartData.length === 0) {
                    await loadLocalCart();
                }
            } else {
                // Se o usuário não estiver logado, carrega o carrinho local
                await loadLocalCart();
            }
        };
        
        loadInitialCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};