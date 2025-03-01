"use client"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr, cartUpdate, getCart, syncCartAfterLogin } from '../services/produto/page';
import { CartContextType } from '../interfaces/interfaces';
import { useAuth } from './auth';

const CartContext = createContext<CartContextType>({
    cartItems: [],
    cartData: [],
    changeQtyItem: () => {},
    addToCart: () => false,
    removeFromCart: () => false,
});

// Função de debounce para limitar chamadas à API
function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
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

    // Efeito para carregar o carrinho quando o componente é montado ou quando o usuário muda
    useEffect(() => {
        console.log('Efeito de carregamento do carrinho acionado, usuário:', user?.id || 'não logado');
        fetchCartData();
    }, [user]);

    // Efeito para detectar login e sincronizar o carrinho
    useEffect(() => {
        const handleLoginStateChange = async () => {
            console.log('Estado de login mudou:', isLoggedIn ? 'logado' : 'deslogado', 'anterior:', previousLoginState ? 'logado' : 'deslogado');
            
            // Se o usuário acabou de fazer login
            if (isLoggedIn && !previousLoginState) {
                console.log('Usuário fez login, sincronizando carrinho...');
                try {
                    const localCartCookie = Cookies.get('cart');
                    const localCart = localCartCookie ? JSON.parse(localCartCookie) : [];
                    
                    //Se houver carrinho local com produtos, sincroniza com o backend
                    if (localCart && Array.isArray(localCart) && localCart.length > 0) {
                        console.log('Carrinho local encontrado com produtos, sincronizando com o backend...');
                        
                        // Sincroniza o carrinho local com o backend
                        // Isso vai manter o carrinho local e atualizar o backend
                        const syncResult = await syncCartAfterLogin();
                        console.log('Resultado da sincronização:', syncResult);
                        
                        if (syncResult.success) {
                            // Carrega os produtos correspondentes aos IDs no carrinho local
                            try {
                                const resp = await getProdsArr(localCart.map(i => i.id));
                                if (resp && resp.data && Array.isArray(resp.data)) {
                                    // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                                    const validCartData = localCart.filter(item => 
                                        resp.data.some(product => product.pro_codigo == item.id)
                                    );
                                    
                                    setCartItems(resp.data);
                                    setCartData(validCartData);
                                }
                            } catch (error) {
                                console.error('Erro ao carregar produtos do carrinho local:', error);
                            }
                        } else if (syncResult.message === 'Token JWT inválido') {
                            // Se o token for inválido, tratamos como usuário deslogado
                            console.log('Token JWT inválido, tratando como usuário deslogado');
                            // Carrega os produtos correspondentes aos IDs no carrinho local
                            try {
                                const resp = await getProdsArr(localCart.map(i => i.id));
                                if (resp && resp.data && Array.isArray(resp.data)) {
                                    // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                                    const validCartData = localCart.filter(item => 
                                        resp.data.some(product => product.pro_codigo == item.id)
                                    );
                                    
                                    setCartItems(resp.data);
                                    setCartData(validCartData);
                                }
                            } catch (error) {
                                console.error('Erro ao carregar produtos do carrinho local:', error);
                            }
                        }
                    } else {
                        console.log('Nenhum carrinho local encontrado, carregando do backend...');
                        // Se não houver carrinho local, carrega do backend
                        await fetchCartData();
                    }
                } catch (error) {
                    console.error('Erro ao sincronizar carrinho após login:', error);
                    // Em caso de erro, tenta carregar do backend
                    await fetchCartData();
                }
            }
            
            setPreviousLoginState(isLoggedIn);
        };
        
        handleLoginStateChange();
    }, [isLoggedIn]);

    // Função para buscar dados do carrinho (tanto do backend quanto local)
    const fetchCartData = async () => {
        try {
            console.log('Buscando dados do carrinho...');
            const cart = await getCart();
            
            if (cart && cart.data) {
                if (cart.data.cart_data) {
                    // Se estiver logado, salva no localStorage também
                    if (isLoggedIn) {
                        localStorage.setItem('cart', JSON.stringify(cart.data.cart_data));
                    }
                    
                    const cartdata = cart.data;
                    if (cartdata.cart_data && Array.isArray(cartdata.cart_data) && cartdata.cart_data.length > 0) {
                        try {
                            console.log('Carregando produtos do carrinho...');
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
                    } else {
                        // Se o carrinho estiver vazio, limpa os estados
                        setCartData([]);
                        setCartItems([]);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do carrinho:', error);
            setCartData([]);
            setCartItems([]);
        }
    };

    const debouncedSendCartToServer = useCallback(
        debounce(() => {
            sendCartToServer();
        }, 1000),
        []
    );

    const sendCartToServer = async () => {
        try {
            // Sempre envia para o servidor (a função cartUpdate lida com usuários deslogados)
            console.log('Enviando carrinho para o servidor...');
            await cartUpdate(cartData);
        } catch (error) {
            console.error('Erro ao enviar carrinho para o servidor:', error);
        }
    };
      
    useEffect(() => {
        if (cartData.length > 0) {
            // Se estiver logado, salva no localStorage
            if (isLoggedIn) {
                if (JSON.stringify(cartData) !== localStorage.getItem('cart')) {
                    localStorage.setItem('cart', JSON.stringify(cartData));
                }
                
                // Também mantém no cookie para garantir consistência
                Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
            } else {
                // Se não estiver logado, salva apenas no cookie
                Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
            }
            
            // Sempre envia para o servidor (a função cartUpdate lida com usuários deslogados)
            sendCartToServer();
        } else if (cartData.length === 0) {
            // Se o carrinho estiver vazio, limpa os cookies e localStorage
            Cookies.remove('cart');
            if (isLoggedIn) {
                localStorage.removeItem('cart');
            }
        }
    }, [cartData, isLoggedIn]);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};