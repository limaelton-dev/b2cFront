"use client"
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr, cartUpdate, getCart } from '../services/produto/page';
import { CartContextType, CartItemDto, CartDataDto } from '../interfaces/interfaces';
import { useAuth } from './auth';

const CartContext = createContext<CartContextType>({
    cartItems: [],
    cartData: [],
    changeQtyItem: () => {},
    addToCart: () => false,
    removeFromCart: () => false,
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
    const [cartItems, setCartItems] = useState([]); // Produtos
    const [cartData, setCartData] = useState([]); // Quantidade, Cor
    const { user } = useAuth();
    const [previousLoginState, setPreviousLoginState] = useState(false);

    const isLoggedIn = !!user && !!user.id;

    const addToCart = (product, idCor) => {
        // Verificar se o produto já existe no carrinho
        const itemExists = cartItems.some(item => 
            item.pro_codigo === product.pro_codigo || 
            item.id === product.id
        );

        if(itemExists) {
            console.log('Produto já existe no carrinho:', product);
            return false;
        }

        // Garantir que o produto tenha um ID válido
        const productId = product.id || product.pro_codigo;
        
        if (!productId) {
            console.error('Produto sem ID válido:', product);
            return false;
        }

        // Verificar se o produto tem preço válido
        if (!product.pro_precovenda && !product.pro_valorultimacompra) {
            console.error('Produto sem preço válido:', product);
            return false;
        }

        console.log('Adicionando produto ao carrinho:', product);

        // Adicionar o produto ao carrinho
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
        
        // Enviar o carrinho para o servidor
        debouncedSendCartToServer();
        
        return true;
    };

    const removeFromCart = (id, idCor) => {
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
    
        debouncedSendCartToServer();
    
        return true;
    };

    const removeItems = () => {
        setCartItems([]);
        setCartData([]);
    }

    const changeQtyItem = (id, newQty) => {
        const updatedItems = cartData.map((item) => {
            if (item.id === id || item.produto_id === id) {
                // Se o item tem o formato antigo (id, qty)
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
    }

    // Função para carregar o carrinho do servidor
    const loadServerCart = async () => {
        try {
            console.log('Iniciando loadServerCart');
            const cart = await getCart();
            console.log('Resposta do getCart:', JSON.stringify(cart));
            
            if (cart && cart.data) {
                console.log('cart.data existe:', JSON.stringify(cart.data));
                
                // Verificar se cart.data.cart_data existe e tem itens
                if (cart.data.cart_data && Array.isArray(cart.data.cart_data) && cart.data.cart_data.length > 0) {
                    console.log('cart.data.cart_data existe e tem itens:', JSON.stringify(cart.data.cart_data));
                    const cartdata = cart.data as CartDataDto;
                    
                    try {
                        // Extrair os IDs dos produtos para buscar detalhes completos
                        const productIds = cartdata.cart_data.map(item => item.produto_id);
                        console.log('IDs de produtos extraídos:', productIds);
                        
                        if (productIds.length === 0) {
                            console.log('Nenhum ID de produto válido encontrado no carrinho');
                            return false;
                        }
                        
                        // Buscar detalhes completos dos produtos
                        const productsResponse = await getProdsArr(productIds);
                        console.log('Resposta do getProdsArr:', JSON.stringify(productsResponse));
                        
                        if (productsResponse && productsResponse.data && Array.isArray(productsResponse.data) && productsResponse.data.length > 0) {
                            console.log('Produtos recuperados com sucesso:', productsResponse.data.length);
                            
                            // Processar as imagens para cada produto
                            const processedProducts = productsResponse.data.map(product => {
                                // Não precisamos mais adicionar pro_imagem, pois agora usamos a função getProductImage no componente
                                // que verifica se há imagens no array de imagens
                                return product;
                            });
                            
                            console.log('Produtos processados:', processedProducts.length);
                            
                            // Converter os itens do carrinho para o formato antigo para manter compatibilidade
                            const convertedCartData = cartdata.cart_data.map(item => {
                                // Encontrar o produto correspondente
                                const product = processedProducts.find(p => p.id == item.produto_id || p.pro_codigo == item.produto_id);
                                
                                return {
                                    id: product ? product.id : item.produto_id, // Usar o ID do produto, não o pro_codigo
                                    qty: item.quantity,
                                    // Não usamos mais o preço do carrinho, apenas a quantidade
                                };
                            });
                            
                            console.log('Atualizando cartItems com:', processedProducts.length, 'produtos');
                            console.log('Atualizando cartData com:', convertedCartData.length, 'itens');
                            
                            setCartItems(processedProducts);
                            setCartData(convertedCartData);
                            localStorage.setItem('cart', JSON.stringify(convertedCartData));
                            return true;
                        } else {
                            console.log('Nenhum produto recuperado ou resposta inválida do getProdsArr');
                            return false;
                        }
                    } catch (error) {
                        console.error('Erro ao processar produtos do carrinho:', error);
                    }
                } else {
                    console.log('cart.data.cart_data está vazio ou não existe');
                }
            } else {
                console.log('cart.data não existe');
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
            console.log('Iniciando loadLocalCart');
            let data;
            const storedData = localStorage.getItem('cart');
            if (storedData) {
                console.log('Dados encontrados no localStorage:', storedData);
                try {
                    data = JSON.parse(storedData);
                    console.log('Dados do localStorage após parse:', data);
                } catch (e) {
                    console.error('Erro ao analisar dados do localStorage:', e);
                    localStorage.removeItem('cart');
                    return false;
                }
            } else {
                console.log('Nenhum dado encontrado no localStorage, verificando cookies');
                const cookieData = Cookies.get('cart');
                if (cookieData) {
                    console.log('Dados encontrados nos cookies:', cookieData);
                    try {
                        data = JSON.parse(cookieData);
                        console.log('Dados dos cookies após parse:', data);
                    } catch (e) {
                        console.error('Erro ao analisar dados do cookie:', e);
                        Cookies.remove('cart');
                        return false;
                    }
                } else {
                    console.log('Nenhum dado encontrado nos cookies');
                }
            }
            
            if (data && Array.isArray(data) && data.length > 0) {
                console.log('Dados do carrinho válidos, buscando produtos');
                try {
                    // Mapeia os IDs dos produtos, considerando tanto o formato antigo quanto o novo
                    const productIds = data.map(item => item.id || item.produto_id);
                    console.log('IDs de produtos extraídos:', productIds);
                    
                    const cart = await getProdsArr(productIds);
                    console.log('Resposta do getProdsArr:', cart);
                    
                    if (cart && cart.data && Array.isArray(cart.data)) {
                        console.log('Produtos recuperados com sucesso:', cart.data.length);
                        
                        // Processar as imagens para cada produto
                        const processedProducts = cart.data.map(product => {
                            // Não precisamos mais adicionar pro_imagem, pois agora usamos a função getProductImage no componente
                            // que verifica se há imagens no array de imagens
                            return product;
                        });
                        
                        console.log('Produtos processados:', processedProducts);
                        
                        // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                        const validCartData = data.filter(item => {
                            const itemId = item.id || item.produto_id;
                            const hasMatch = processedProducts.some(product => product.id == itemId || product.pro_codigo == itemId);
                            return hasMatch;
                        });
                        
                        console.log('Itens válidos do carrinho:', validCartData);
                        
                        setCartData(validCartData);
                        setCartItems(processedProducts);
                        return true;
                    } else {
                        console.log('Nenhum produto recuperado ou resposta inválida');
                    }
                } catch (error) {
                    console.error('Erro ao buscar produtos do carrinho:', error);
                }
            } else {
                console.log('Dados do carrinho inválidos ou vazios');
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
            console.log('Sincronizando carrinho, isLoggedIn:', isLoggedIn, 'previousLoginState:', previousLoginState);
            
            // Se o usuário acabou de fazer login
            if (isLoggedIn && !previousLoginState) {
                console.log('Usuário acabou de fazer login');
                
                // Primeiro, carrega o carrinho do servidor para verificar se já existe
                const serverCartLoaded = await loadServerCart();
                console.log('Carrinho do servidor carregado?', serverCartLoaded);
                
                // Se não houver um carrinho no servidor, verifica se há um carrinho local
                if (!serverCartLoaded) {
                    console.log('Carrinho do servidor vazio, verificando carrinho local');
                    const hasLocalCart = await loadLocalCart();
                    console.log('Carrinho local carregado?', hasLocalCart, 'Itens:', cartData.length);
                    
                    // Se houver um carrinho local com produtos, atualiza o carrinho do servidor
                    if (hasLocalCart && cartData.length > 0) {
                        console.log('Atualizando carrinho do servidor com carrinho local');
                        await sendCartToServer();
                    }
                }
            } else if (isLoggedIn) {
                console.log('Usuário já estava logado, carregando carrinho do servidor');
                // Se o usuário já estava logado, apenas carrega o carrinho do servidor
                await loadServerCart();
            } else {
                console.log('Usuário deslogado, carregando carrinho local');
                // Se o usuário está deslogado, carrega o carrinho local
                await loadLocalCart();
            }
            
            // Atualiza o estado anterior de login
            setPreviousLoginState(isLoggedIn);
            console.log('Estado anterior de login atualizado para:', isLoggedIn);
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
        console.log('Iniciando envio do carrinho para o servidor');
        
        // Sempre salva no localStorage/cookies
        if (cartData.length > 0) {
            console.log('Salvando carrinho no localStorage e cookies:', cartData);
            localStorage.setItem('cart', JSON.stringify(cartData));
            Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
        } else {
            console.log('Carrinho vazio, removendo do localStorage e cookies');
            localStorage.removeItem('cart');
            Cookies.remove('cart');
        }
        
        // Se estiver logado, também envia para o servidor
        if (isLoggedIn) {
            console.log('Usuário logado, enviando carrinho para o servidor');
            
            // Verificar se há itens no carrinho
            if (cartData.length === 0) {
                console.log('Carrinho vazio, não enviando para o servidor');
                return;
            }
            
            // Verificar se todos os itens têm produtos correspondentes
            const validCartData = cartData.filter(item => {
                const itemId = item.id || item.produto_id;
                return cartItems.some(product => product && (product.id == itemId || product.pro_codigo == itemId));
            });
            
            if (validCartData.length === 0) {
                console.log('Nenhum item válido no carrinho, não enviando para o servidor');
                return;
            }
            
            console.log('Itens válidos para envio:', validCartData.length);
            
            // Converte os dados para o novo formato antes de enviar para o backend
            const convertedCartData = validCartData.map(item => {
                // Encontrar o produto correspondente
                const itemId = item.id || item.produto_id;
                const product = cartItems.find(p => p && (p.id == itemId || p.pro_codigo == itemId));
                
                // Se já estiver no novo formato
                if (item.produto_id !== undefined) {
                    return {
                        produto_id: product ? product.id : item.produto_id, // Usar o ID do produto, não o pro_codigo
                        quantity: item.quantity || 1,
                        // Encontrar o produto correspondente para obter o preço
                        price: getProductPrice(item)
                    };
                }
                // Converte do formato antigo para o novo
                return {
                    produto_id: product ? product.id : item.id, // Usar o ID do produto, não o pro_codigo
                    quantity: item.qty || 1,
                    // Encontrar o produto correspondente para obter o preço
                    price: getProductPrice(item)
                };
            });
            
            console.log('Dados convertidos para envio:', convertedCartData);
            
            // Envia os dados no formato esperado pelo backend
            cartUpdate({ cart_data: convertedCartData })
                .then(response => {
                    console.log('Resposta da atualização do carrinho:', response);
                })
                .catch(error => {
                    console.error('Erro ao atualizar carrinho no servidor:', error);
                });
        } else {
            console.log('Usuário não logado, não enviando para o servidor');
        }
    };

    // Função auxiliar para obter o preço do produto correspondente ao item do carrinho
    const getProductPrice = (item) => {
        const itemId = item.id || item.produto_id;
        const product = cartItems.find(p => p && (p.id == itemId || p.pro_codigo == itemId));
        
        if (product && product.pro_precovenda) {
            return product.pro_precovenda;
        }
        
        if (product && product.pro_valorultimacompra) {
            return product.pro_valorultimacompra;
        }
        
        return 0;
    };

    useEffect(() => {
        debouncedSendCartToServer();
    }, [cartData]);

    // Carrega o carrinho inicial
    useEffect(() => {
        const loadInitialCart = async () => {
            console.log('Carregando carrinho inicial, isLoggedIn:', isLoggedIn);
            
            if (isLoggedIn) {
                console.log('Usuário logado, tentando carregar carrinho do servidor');
                // Se o usuário estiver logado, tenta carregar o carrinho do servidor
                const serverCartLoaded = await loadServerCart();
                console.log('Carrinho do servidor carregado?', serverCartLoaded, 'Itens:', cartItems.length);
                
                // Se não conseguir carregar do servidor ou o carrinho estiver vazio, tenta carregar do local
                if (!serverCartLoaded || cartItems.length === 0) {
                    console.log('Carrinho do servidor vazio ou não carregado, tentando carrinho local');
                    const localCartLoaded = await loadLocalCart();
                    console.log('Carrinho local carregado?', localCartLoaded, 'Itens:', cartItems.length);
                    
                    // Se houver um carrinho local, envia para o servidor
                    if (localCartLoaded && cartItems.length > 0) {
                        console.log('Enviando carrinho local para o servidor');
                        await sendCartToServer();
                    }
                }
            } else {
                console.log('Usuário não logado, carregando carrinho local');
                // Se o usuário não estiver logado, carrega o carrinho local
                await loadLocalCart();
            }
            
            console.log('Carrinho inicial carregado, cartItems:', cartItems.length, 'cartData:', cartData.length);
        };
        
        loadInitialCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart, removeItems }}>
        {children}
        </CartContext.Provider>
    );
};