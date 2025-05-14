"use client"
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr } from '../services/produto/page';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { getProduto } from '../services/produto/page';
import { CartContextType, Cart, CartItem } from '../interfaces/interfaces';
import { useAuth } from './auth';

const CartContext = createContext<CartContextType>({
    cartItems: [],
    cartData: [],
    changeQtyItem: () => {},
    addToCart: async () => false,
    removeFromCart: async () => false,
    removeItems: (): void => {}
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
    const [cartItems, setCartItems] = useState([]); // Produtos completos
    const [cartData, setCartData] = useState([]); // Itens do carrinho (ID, quantidade)
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [previousLoginState, setPreviousLoginState] = useState(false);

    const isLoggedIn = !!user && !!user.id;

    /**
     * Adiciona um produto ao carrinho
     */
    const addToCart = async (product, idCor) => {
        console.log("Tentando adicionar produto ao carrinho:", product);
        
        // Verificar se o produto já existe no carrinho
        const productId = product.id || product.pro_codigo;
        
        if (!productId) {
            console.error("ID do produto não encontrado");
            return false;
        }
        
        console.log("ID do produto:", productId);
        
        const itemExists = cartData.some(item => {
            const itemProductId = item.productId || item.produto_id;
            return itemProductId == productId;
        });

        if (itemExists) {
            console.log("Produto já existe no carrinho");
            return false;
        }

        // Verificar se o produto tem preço válido
        if (!product.pro_precovenda && !product.price && !product.pro_valorultimacompra) {
            console.error("Produto sem preço válido");
            return false;
        }

        try {
            if (isLoggedIn) {
                // Se estiver logado, usa a API para adicionar ao carrinho
                console.log("Usuário logado, adicionando ao servidor");
                setIsLoading(true);
                
                const response = await addCartItem(productId, 1);
                console.log("Resposta do servidor:", response);
                
                // Recarregar o carrinho completo do servidor para garantir consistência
                await loadCartFromServer();
                setIsLoading(false);
            } else {
                // Se não estiver logado, adiciona localmente
                console.log("Usuário não logado, adicionando localmente");
                
                setCartData((prevItems) => {
                    if (!Array.isArray(prevItems)) {
                        return [{
                            produto_id: productId,
                            quantity: 1,
                        }];
                    }
                    return [...prevItems, {
                        produto_id: productId,
                        quantity: 1,
                        idCart: prevItems.length + 1
                    }];
                });
                
                setCartItems((prevItems) => [...prevItems, product]);
                
                // Salvar no localStorage e cookie
                debouncedSaveLocalCart();
            }
            
            console.log("Produto adicionado com sucesso");
            return true;
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            setIsLoading(false);
            return false;
        }
    };

    /**
     * Remove um item do carrinho
     */
    const removeFromCart = async (id, idCor) => {
        try {
            if (isLoggedIn) {
                // Se estiver logado, usa a API para remover do carrinho
                // Primeiro, encontrar o item do carrinho pelo productId
                const cartItem = cartData.find(item => item.productId === id || item.produto_id === id);
                
                if (cartItem && cartItem.id) {
                    setIsLoading(true);
                    await removeCartItem(cartItem.id);
                    await loadCartFromServer();
                    setIsLoading(false);
                }
            } else {
                // Se não estiver logado, remove localmente
                const updatedCartData = cartData.filter(
                    item => !((item.id === id || item.produto_id === id))
                );
                setCartData(updatedCartData);
            
                const hasOtherItemsWithSameId = updatedCartData.some(
                    item => item.id === id || item.produto_id === id
                );
                if (!hasOtherItemsWithSameId) {
                    setCartItems(cartItems.filter(item => !(item.id === id || item.pro_codigo === id)));
                }
            
                // Salvar no localStorage e cookie
                debouncedSaveLocalCart();
            }
        
            return true;
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            setIsLoading(false);
            return false;
        }
    };

    /**
     * Limpa o carrinho completamente
     */
    const removeItems = async () => {
        try {
            if (isLoggedIn) {
                // Se estiver logado, usa a API para limpar o carrinho
                setIsLoading(true);
                await clearCart();
                setCartItems([]);
                setCartData([]);
                setIsLoading(false);
            } else {
                // Se não estiver logado, limpa localmente
                setCartItems([]);
                setCartData([]);
                localStorage.removeItem('cart');
                Cookies.remove('cart');
            }
        } catch (error) {
            console.error('Erro ao limpar o carrinho:', error);
            setIsLoading(false);
        }
    }

    /**
     * Altera a quantidade de um item no carrinho
     */
    const changeQtyItem = async (id, newQty) => {
        try {
            if (isLoggedIn) {
                // Se estiver logado, usa a API para atualizar a quantidade
                // Primeiro, encontrar o item do carrinho pelo productId
                const cartItem = cartData.find(item => item.productId === id || item.produto_id === id);
                
                if (cartItem && cartItem.id) {
                    setIsLoading(true);
                    await updateCartItem(cartItem.id, newQty);
                    await loadCartFromServer();
                    setIsLoading(false);
                }
            } else {
                // Se não estiver logado, atualiza localmente
                const updatedItems = cartData.map((item) => {
                    if (item.id === id || item.produto_id === id) {
                        if (item.id !== undefined) {
                            return { ...item, qty: newQty };
                        }
                        // Se o item tem o formato novo (produto_id, quantity)
                        else if (item.produto_id !== undefined) {
                            return { ...item, quantity: newQty };
                        }
                    }
                    return item;
                });
                setCartData(updatedItems);
                
                // Salvar no localStorage e cookie
                debouncedSaveLocalCart();
            }
        } catch (error) {
            console.error('Erro ao alterar quantidade do item:', error);
            setIsLoading(false);
        }
    }

    /**
     * Carrega o carrinho do servidor
     */
    const loadCartFromServer = async () => {
        try {
            console.log("Iniciando carregamento do carrinho do servidor");
            const serverCart = await getCart();
            console.log("Carrinho recebido do servidor:", serverCart);
            
            if (serverCart && serverCart.items && Array.isArray(serverCart.items)) {
                // Carregar detalhes dos produtos para cada item do carrinho
                const productIds = serverCart.items.map(item => item.productId);
                console.log("IDs dos produtos no carrinho:", productIds);
                
                if (productIds.length > 0) {
                    // Buscar detalhes dos produtos
                    console.log("Buscando detalhes dos produtos...");
                    const productsData = await getProdsArr(productIds);
                    console.log("Detalhes dos produtos recebidos:", productsData);
                    
                    if (productsData && productsData.data && Array.isArray(productsData.data)) {
                        console.log("Produtos válidos encontrados:", productsData.data.length);
                        
                        // Formatar itens do carrinho para o formato usado pelo contexto
                        const formattedCartData = serverCart.items.map(item => ({
                            id: item.id,
                            produto_id: item.productId,
                            productId: item.productId,  // Adicionar productId para compatibilidade
                            quantity: item.quantity
                        }));
                        
                        console.log("Dados do carrinho formatados:", formattedCartData);
                        
                        // Garantir que os produtos e IDs sejam correspondentes
                        const validProducts = productsData.data.filter(product => 
                            productIds.includes(product.id || product.pro_codigo)
                        );
                        
                        if (validProducts.length === 0) {
                            console.error("Nenhum produto válido encontrado!");
                        }
                        
                        console.log("Produtos válidos:", validProducts);
                        console.log("Atualizando estado do carrinho...");
                        
                        setCartData(formattedCartData);
                        setCartItems(validProducts.length > 0 ? validProducts : productsData.data);
                        
                        console.log("Estado do carrinho atualizado!");
                        return true;
                    } else {
                        console.error("Resposta inválida da API de produtos:", productsData);
                    }
                } else {
                    // Carrinho vazio
                    console.log("Carrinho vazio, limpando estado");
                    setCartData([]);
                    setCartItems([]);
                    return true;
                }
            } else {
                console.error("Resposta inválida da API de carrinho:", serverCart);
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao carregar carrinho do servidor:', error);
            return false;
        }
    };

    /**
     * Carrega o carrinho do localStorage
     */
    const loadLocalCart = async () => {
        try {
            let data;
            const storedData = localStorage.getItem('cart');
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (e) {
                    localStorage.removeItem('cart');
                    return false;
                }
            } else {
                const cookieData = Cookies.get('cart');
                if (cookieData) {
                    try {
                        data = JSON.parse(cookieData);
                    } catch (e) {
                        Cookies.remove('cart');
                        return false;
                    }
                }
            }
            
            if (data && Array.isArray(data) && data.length > 0) {
                try {
                    // Mapeia os IDs dos produtos
                    const productIds = data.map(item => item.id || item.produto_id);
                    
                    const products = await getProdsArr(productIds);
                    
                    if (products && products.data && Array.isArray(products.data)) {
                        // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                        const validCartData = data.filter(item => {
                            const itemId = item.id || item.produto_id;
                            const hasMatch = products.data.some(product => product.id == itemId || product.pro_codigo == itemId);
                            return hasMatch;
                        });
                        
                        setCartData(validCartData);
                        setCartItems(products.data);
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

    /**
     * Salva o carrinho local no localStorage e cookie
     */
    const saveLocalCart = () => {
        if (cartData.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartData));
            Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
        } else {
            localStorage.removeItem('cart');
            Cookies.remove('cart');
        }
    };

    /**
     * Versão com debounce da função saveLocalCart
     */
    const debouncedSaveLocalCart = debounce(saveLocalCart, 500);

    // Sincronizar carrinho quando o estado de login muda
    useEffect(() => {
        const syncCart = async () => {
            // Se o usuário acabou de fazer login
            if (isLoggedIn && !previousLoginState) {
                // Carrega o carrinho do servidor
                const serverCartLoaded = await loadCartFromServer();
                
                // Se não houver carrinho no servidor e houver itens no carrinho local
                if (!serverCartLoaded && cartData.length > 0) {
                    // Adiciona os itens do carrinho local ao servidor
                    setIsLoading(true);
                    
                    try {
                        // Adiciona cada item do carrinho local ao servidor
                        for (const item of cartData) {
                            const productId = item.id || item.produto_id;
                            const quantity = item.quantity || item.qty || 1;
                            
                            await addCartItem(productId, quantity);
                        }
                        
                        await loadCartFromServer();
                    } catch (error) {
                        console.error('Erro ao sincronizar carrinho com o servidor:', error);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } else if (isLoggedIn) {
                // Se já estava logado, apenas atualiza o carrinho do servidor
                await loadCartFromServer();
            } else {
                // Se não está logado, carrega o carrinho local
                await loadLocalCart();
            }
            
            // Atualiza o estado anterior de login
            setPreviousLoginState(isLoggedIn);
        };
        
        syncCart();
    }, [isLoggedIn]);

    // Efeito para recarregar o carrinho quando necessário
    useEffect(() => {
        // Carrega o carrinho inicial
        const loadInitialCart = async () => {
            if (isLoggedIn) {
                await loadCartFromServer();
            } else {
                await loadLocalCart();
            }
        };
        
        loadInitialCart();
    }, []);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            cartData, 
            changeQtyItem, 
            addToCart, 
            removeFromCart, 
            removeItems 
        }}>
            {children}
        </CartContext.Provider>
    );
};