"use client"
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { getProdsArr, cartUpdate, getCart, addToCartServer, removeFromCartServer } from '../services/produto/page';
import { CartContextType, CartItemDto, CartDataDto } from '../interfaces/interfaces';
import { useAuth } from './auth';
import axios from 'axios';
import { getToken, isAuthenticated } from '../utils/auth';

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
    const [cartItems, setCartItems] = useState(() => {
        // Inicializar cartItems com um array vazio
        return [];
    });
    const [cartData, setCartData] = useState(() => {
        // Tentar carregar do localStorage durante a inicialização
        if (typeof window !== 'undefined') {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    console.log('Carregado estado inicial do carrinho do localStorage:', parsedCart);
                    return parsedCart;
                }
            } catch (e) {
                console.error('Erro ao carregar estado inicial do carrinho:', e);
            }
        }
        return [];
    });
    const { user } = useAuth();
    const [previousLoginState, setPreviousLoginState] = useState(false);
    const [syncInProgress, setSyncInProgress] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const isLoggedIn = !!user && !!user.id;

    const addToCart = (product) => {
        console.log(`Adicionando produto ao carrinho: ${JSON.stringify(product)}`);
        
        const itemExists = cartItems.some(item => 
            item.id === product.id
        );

        if(itemExists) {
            console.log(`Produto ${product.id} já existe no carrinho`);
            return false;
        }

        const productId = product.id;
        
        if (!productId) {
            console.log(`Produto sem ID válido`);
            return false;
        }

        // Verificar se o produto tem preço válido
        if (!product.price) {
            console.log(`Produto sem preço válido`);
            return false;
        }

        // Criar dados do item para o carrinho
        const cartItem = {
                    productId: productId,
                    quantity: 1,
                    id: productId
        };

        // Adicionar o produto ao carrinho
        const updatedCartData = [...cartData, cartItem];
        
        console.log(`Atualizando estado do carrinho com novo item: ${JSON.stringify(cartItem)}`);
        setCartData(updatedCartData);
        setCartItems((prevItems) => [...prevItems, product]);
        
        // Salvar os dados no localStorage imediatamente
        console.log(`Salvando carrinho no localStorage: ${JSON.stringify(updatedCartData)}`);
        localStorage.setItem('cart', JSON.stringify(updatedCartData));
        Cookies.set('cart', JSON.stringify(updatedCartData), { expires: 7 });
        
        // Verificar se os dados foram salvos corretamente
        const savedCart = localStorage.getItem('cart');
        console.log(`Verificando se o carrinho foi salvo no localStorage: ${savedCart ? 'Sim' : 'Não'}`);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                console.log(`Carrinho salvo: ${JSON.stringify(parsedCart)}`);
                
                // Verificar se o produto foi adicionado corretamente
                const productAdded = parsedCart.some(item => 
                    (item.id === productId || item.productId === productId)
                );
                console.log(`Produto ${productId} encontrado no carrinho salvo: ${productAdded ? 'Sim' : 'Não'}`);
            } catch (e) {
                console.error(`Erro ao analisar carrinho salvo: ${e.message}`);
            }
        }
        
        // Se o usuário estiver logado, adicionar o produto diretamente ao servidor
        if (isLoggedIn) {
            addProductToServer({
                productId: productId,
                quantity: 1
            });
        } else {
            console.log(`Usuário não está logado. Carrinho salvo apenas localmente.`);
            // Não usamos mais o debouncedSendCartToServer para usuários não logados
            // pois já salvamos no localStorage acima
        }
        
        return true;
    };

    const removeFromCart = (id) => {
        console.log(`Removendo produto do carrinho: ${id}`);
        
        const updatedCartData = cartData.filter(
            item => !((item.id === id || item.productId === id))
        );
        setCartData(updatedCartData);
    
        const hasOtherItemsWithSameId = updatedCartData.some(
            item => item.id === id || item.productId === id
        );
        if (!hasOtherItemsWithSameId) {
            setCartItems(cartItems.filter(item => !(item.id === id || item.id === id)));
        }
    
        // Atualizar localStorage e cookies
        if (updatedCartData.length > 0) {
            localStorage.setItem('cart', JSON.stringify(updatedCartData));
            Cookies.set('cart', JSON.stringify(updatedCartData), { expires: 7 });
        } else {
            localStorage.removeItem('cart');
            Cookies.remove('cart');
        }
    
        // Se o usuário estiver logado, remover o produto diretamente do servidor
        if (isLoggedIn) {
            removeProductFromServer(id);
        } else {
            // Usar o método debounced para usuários não logados
        debouncedSendCartToServer(2, id);
        }
    
        return true;
    };

    const removeItems = () => {
        setCartItems([]);
        setCartData([]);
        
        // Limpar localStorage e cookies
        localStorage.removeItem('cart');
        Cookies.remove('cart');
        
        // Limpar carrinho no servidor se estiver autenticado
        if (isLoggedIn) {
            try {
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                };
                axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, { headers });
            } catch (error) {
                console.error('Erro ao limpar carrinho no servidor:', error);
            }
        }
    }

    const changeQtyItem = (id, newQty) => {
        console.log(`Alterando quantidade do item ${id} para ${newQty}`);
        
        // Garantir que a quantidade seja um número positivo
        newQty = Math.max(1, parseInt(newQty) || 1);
        
        const updatedItems = cartData.map((item) => {
            if (item.id === id || item.productId === id) {
                if (item.id !== undefined) {
                    return { ...item, quantity: newQty };
                }
                // Se o item tem o formato novo (produto_id, quantity)
                else if (item.productId !== undefined) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        });
        setCartData(updatedItems);
        
        // Atualizar localStorage e cookies
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        Cookies.set('cart', JSON.stringify(updatedItems), { expires: 7 });
        
        // Se o usuário estiver logado, atualizar diretamente no servidor em vez de usar debounce
        if (isLoggedIn) {
            const item = updatedItems.find(item => (item.id === id || item.productId === id));
            if (item) {
                updateQuantityOnServer(id, newQty);
            }
        } else {
            debouncedSendCartToServer(3, id);
        }
    }

    // Nova função para atualizar a quantidade diretamente no servidor
    const updateQuantityOnServer = async (productId, quantity) => {
        // Verificar se o usuário está autenticado
        if (!isAuthenticated()) {
            console.log("Usuário não autenticado, não atualizando quantidade no servidor");
            return;
        }
        
        try {
            console.log(`Enviando atualização de quantidade para o servidor: Produto ${productId}, Quantidade ${quantity}`);
            
            // Evitar atualizações durante sincronização
            if (syncInProgress) {
                console.log("Processo de sincronização em andamento, adiando atualização");
                setTimeout(() => updateQuantityOnServer(productId, quantity), 1000);
                return;
            }
            
            // Usar a função cartUpdate existente que já implementa toda a lógica necessária
            // incluindo o gerenciamento de tokens, tratamento de erros, etc.
            const itemData = { 
                item: { 
                    productId, 
                    quantity 
                } 
            };
            
            console.log(`Chamando cartUpdate com: ${JSON.stringify(itemData)}`);
            
            const response = await cartUpdate(itemData, productId);
            
            console.log("Resposta da atualização de quantidade:", response);
            
            // Verificar se a atualização foi bem-sucedida
            if (response && (response.status >= 200 && response.status < 300)) {
                console.log(`Quantidade do produto ${productId} atualizada para ${quantity} com sucesso`);
                return true;
            } else {
                console.error(`Erro ao atualizar quantidade: ${response?.status || 'Desconhecido'}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade no servidor:', error);
            
            // Tentar novamente se for um erro temporário (429, 500, etc.)
            if (error.response && (error.response.status >= 429 || error.response.status >= 500)) {
                console.log("Erro temporário, tentando novamente em 2 segundos...");
                setTimeout(() => updateQuantityOnServer(productId, quantity), 2000);
            }
            return false;
        }
    }

    // Função para carregar o carrinho do servidor
    const loadServerCart = async () => {
        try {
            setSyncInProgress(true);
            const cart = await getCart();
            
            if (cart && cart.data) {
                
                // Verificar se cart.data.items existe e tem itens
                if (cart.data.items && Array.isArray(cart.data.items) && cart.data.items.length > 0) {
                    const cartdata = cart.data;
                    
                    try {
                        // Log para debug - mostrar os itens recebidos do servidor
                        console.log('Itens recebidos do servidor:', JSON.stringify(cartdata.items));
                        
                        // Verificar se há itens duplicados no carrinho do servidor
                        const itemsGrouped: { [key: string]: { productId: number | string, quantity: number } } = {};
                        let hasDuplicates = false;
                        
                        cartdata.items.forEach(item => {
                            const key = item.productId.toString();
                            if (itemsGrouped[key]) {
                                hasDuplicates = true;
                                itemsGrouped[key].quantity += item.quantity;
                            } else {
                                itemsGrouped[key] = {
                                    productId: item.productId,
                                    quantity: item.quantity
                                };
                            }
                        });
                        
                        // Log para debug
                        if (hasDuplicates) {
                            console.log('Detectados itens duplicados no carrinho do servidor. Items consolidados:', JSON.stringify(Object.values(itemsGrouped)));
                        }
                        
                        // Usar os itens já consolidados em vez de fazer isso novamente depois
                        const productIds = Object.keys(itemsGrouped).map(key => parseInt(key));

                        if (productIds.length === 0) {
                            setSyncInProgress(false);
                            return false;
                        }
                        
                        // Buscar detalhes completos dos produtos
                        const productsResponse = await getProdsArr(productIds);
                        
                        if (productsResponse && productsResponse.data && Array.isArray(productsResponse.data) && productsResponse.data.length > 0) {
                            
                            // Processar as imagens para cada produto
                            const processedProducts = productsResponse.data.map(product => {
                                return product;
                            });
                            
                            // Converter para array no formato esperado pelo componente
                            // Usamos os itens já consolidados do itemsGrouped
                            const convertedCartData = Object.values(itemsGrouped).map(item => {
                                // Encontrar o produto correspondente
                                const product = processedProducts.find(p => p.id == item.productId);
                                
                                return {
                                    id: product ? product.id : item.productId, // Usar o ID do produto, não o pro_codigo
                                    quantity: item.quantity,
                                    // Não usamos mais o preço do carrinho, apenas a quantidade
                                };
                            });
                            
                            setCartItems(processedProducts);
                            setCartData(convertedCartData);
                            localStorage.setItem('cart', JSON.stringify(convertedCartData));
                            
                            // Se houve duplicados no carrinho do servidor, considere remover e reenviar os itens
                            // para limpar as duplicações no servidor
                            if (hasDuplicates && isLoggedIn) {
                                console.log('Consolidando itens duplicados no carrinho do servidor...');
                                
                                try {
                                    // Limpar itens do carrinho no servidor
                                    await removeItems();
                                    
                                    // Aguardar um tempo para garantir que o servidor processou a remoção
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    
                                    // Restaurar os itens no estado para que não sejam perdidos após a limpeza
                                    setCartItems(processedProducts);
                                    setCartData(convertedCartData);
                                    
                                    // Reenviar os itens consolidados
                                    const consolidatedItems = Object.values(itemsGrouped);
                                    
                                    for (const item of consolidatedItems) {
                                        try {
                                            const response = await addToCartServer(item);
                                            console.log('Item consolidado enviado ao servidor:', response);
                                        } catch (error) {
                                            console.error('Erro ao consolidar item no servidor:', error);
                                        }
                                    }
                                } catch (error) {
                                    console.error('Erro ao consolidar carrinho no servidor:', error);
                                }
                            }
                            
                            setSyncInProgress(false);
                            return true;
                        } else {
                            setSyncInProgress(false);
                            return false;
                        }
                    } catch (error) {
                        console.error('Erro ao processar produtos do carrinho:', error);
                        setSyncInProgress(false);
                    }
                }
            }
            setSyncInProgress(false);
            return false;
        } catch (error) {
            console.error('Erro ao buscar dados do carrinho:', error);
            setSyncInProgress(false);
            return false;
        }
    };

    // Função para carregar o carrinho local
    const loadLocalCart = async () => {
        try {
            setSyncInProgress(true);
            let data;
            const storedData = localStorage.getItem('cart');
            console.log(`Carregando carrinho do localStorage: ${storedData || 'Vazio'}`);
            
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                    console.log(`Carrinho carregado do localStorage: ${JSON.stringify(data)}`);
                } catch (e) {
                    console.error(`Erro ao analisar o carrinho do localStorage: ${e.message}`);
                    localStorage.removeItem('cart');
                    setSyncInProgress(false);
                    return false;
                }
            } else {
                const cookieData = Cookies.get('cart');
                console.log(`Carregando carrinho dos cookies: ${cookieData || 'Vazio'}`);
                if (cookieData) {
                    try {
                        data = JSON.parse(cookieData);
                        console.log(`Carrinho carregado dos cookies: ${JSON.stringify(data)}`);
                    } catch (e) {
                        console.error(`Erro ao analisar o carrinho dos cookies: ${e.message}`);
                        Cookies.remove('cart');
                        setSyncInProgress(false);
                        return false;
                    }
                }
            }
            
            if (data && Array.isArray(data) && data.length > 0) {
                try {
                    // Mapeia os IDs dos produtos, considerando tanto o formato antigo quanto o novo
                    const productIds = data.map(item => item.id || item.productId);
                    
                    const cart = await getProdsArr(productIds);
                    
                    if (cart && cart.data && Array.isArray(cart.data)) {
                        
                        // Processar as imagens para cada produto
                        const processedProducts = cart.data.map(product => {
                            return product;
                        });
                        
                        // Filtra os itens do carrinho para incluir apenas aqueles que têm produtos correspondentes
                        const validCartData = data.filter(item => {
                            const itemId = item.id || item.produto_id;
                            const hasMatch = processedProducts.some(product => product.id == itemId || product.id == itemId);
                            return hasMatch;
                        });
                        
                        setCartData(validCartData);
                        setCartItems(processedProducts);
                        setSyncInProgress(false);
                        return true;
                    }
                } catch (error) {
                    console.error('Erro ao buscar produtos do carrinho:', error);
                    setSyncInProgress(false);
                }
            }
            setSyncInProgress(false);
            return false;
        } catch (error) {
            console.error('Erro ao processar dados do carrinho:', error);
            setSyncInProgress(false);
            return false;
        }
    };

    // Efeito para sincronizar o carrinho quando o estado de login muda
    useEffect(() => {
        let syncTimeout: NodeJS.Timeout | null = null;
        
        const syncCart = async () => {
            console.log(`syncCart executando. isLoggedIn: ${isLoggedIn}, previousLoginState: ${previousLoginState}, syncInProgress: ${syncInProgress}`);
            
            // Configurar um timeout para garantir que o processo de sincronização não trave
            syncTimeout = setTimeout(() => {
                console.log('Timeout de sincronização atingido, finalizando syncInProgress');
                setSyncInProgress(false);
                setPreviousLoginState(isLoggedIn);
            }, 10000); // 10 segundos de timeout máximo
            
            try {
            // Se o usuário acabou de fazer login
            if (isLoggedIn && !previousLoginState) {
                    // Quando o usuário acabou de fazer login, devemos sincronizar o carrinho local com o servidor
                    console.log('Usuário acabou de fazer login. Sincronizando carrinhos...');
                    
                    try {
                        // Primeiro tentamos carregar o carrinho do servidor com um timeout menor
                        const serverCartLoadPromise = loadServerCart();
                        
                        // Adicionar um timeout para a operação de carregamento do servidor
                        const serverTimeout = new Promise<boolean>((resolve) => {
                            setTimeout(() => {
                                console.log('Timeout ao carregar carrinho do servidor, continuando...');
                                resolve(false);
                            }, 5000); // 5 segundos de timeout
                        });
                        
                        // Usar Promise.race para limitar o tempo de espera
                        const serverCartLoaded = await Promise.race([serverCartLoadPromise, serverTimeout]);
                        
                        // Verifica se há itens no carrinho local
                        const storedData = localStorage.getItem('cart');
                        const hasLocalItems = storedData && JSON.parse(storedData).length > 0;
                        
                        // Se há itens no carrinho local, enviamos para o servidor
                        if (hasLocalItems) {
                            console.log('Enviando itens do carrinho local para o servidor após login...');
                            
                            // Se há itens no carrinho do servidor, limpar o carrinho do servidor antes
                            // para evitar duplicidades quando enviarmos o carrinho local
                            if (serverCartLoaded && cartItems.length > 0) {
                                console.log('Limpando carrinho do servidor antes de enviar itens locais...');
                                
                                try {
                                    // Primeiro salvar os itens locais em variáveis temporárias
                                    const localCartItems = [...cartItems];
                                    const localCartData = [...cartData];
                                    
                                    // Limpar o carrinho do servidor com timeout reduzido
                                    const token = getToken();
                                    if (token) {
                                        try {
                                            const clearPromise = axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
                                                headers: { 'Authorization': `Bearer ${token}` },
                                                timeout: 3000 // 3 segundos de timeout
                                            });
                                            
                                            // Adicionar um timeout para a operação de limpeza
                                            const clearTimeout = new Promise<void>((resolve) => {
                                                setTimeout(() => {
                                                    console.log('Timeout ao limpar carrinho do servidor, continuando...');
                                                    resolve();
                                                }, 3000);
                                            });
                                            
                                            // Usar Promise.race para limitar o tempo de espera
                                            await Promise.race([clearPromise, clearTimeout]);
                                        } catch (error) {
                                            console.error('Erro ao limpar carrinho no servidor:', error);
                                        }
                                    }
                                    
                                    // Restaurar os itens locais depois de limpar o servidor
                                    setCartItems(localCartItems);
                                    setCartData(localCartData);
                                    
                                    // Reduzir o tempo de espera para garantir que o processamento continue
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    
                                    // Agora enviar o carrinho local para o servidor com timeout
                                    const sendPromise = sendCartLocalServer();
                                    const sendTimeout = new Promise<void>((resolve) => {
                                        setTimeout(() => {
                                            console.log('Timeout ao enviar carrinho para o servidor, continuando...');
                                            resolve();
                                        }, 3000);
                                    });
                                    
                                    await Promise.race([sendPromise, sendTimeout]);
                                } catch (error) {
                                    console.error('Erro ao limpar carrinho no servidor:', error);
                                }
                            } else {
                                // Se o servidor não tem itens ou não conseguimos carregar, enviamos o carrinho local diretamente
                                try {
                                    const loadPromise = loadLocalCart();
                                    const loadTimeout = new Promise<boolean>((resolve) => {
                                        setTimeout(() => {
                                            console.log('Timeout ao carregar carrinho local, continuando...');
                                            resolve(false);
                                        }, 3000);
                                    });
                                    
                                    await Promise.race([loadPromise, loadTimeout]);
                                    
                                    const sendPromise = sendCartLocalServer();
                                    const sendTimeout = new Promise<void>((resolve) => {
                                        setTimeout(() => {
                                            console.log('Timeout ao enviar carrinho para o servidor, continuando...');
                                            resolve();
                                        }, 3000);
                                    });
                                    
                                    await Promise.race([sendPromise, sendTimeout]);
                                } catch (error) {
                                    console.error('Erro ao processar carrinho local:', error);
                                }
                            }
                        } else if (serverCartLoaded) {
                            // Se não há itens locais mas há no servidor, mantenha os do servidor
                            console.log('Mantendo itens do carrinho do servidor após login...');
                        } else {
                            // Nem servidor nem local têm itens
                            console.log('Nenhum item no carrinho local ou do servidor após login...');
                            
                            const loadPromise = loadLocalCart();
                            const loadTimeout = new Promise<boolean>((resolve) => {
                                setTimeout(() => {
                                    console.log('Timeout ao carregar carrinho local, continuando...');
                                    resolve(false);
                                }, 3000);
                            });
                            
                            await Promise.race([loadPromise, loadTimeout]);
                        }
                    } catch (error) {
                        console.error('Erro ao sincronizar carrinho após login:', error);
                        // Tentar pelo menos carregar o que tiver localmente com timeout
                        try {
                            const loadPromise = loadLocalCart();
                            const loadTimeout = new Promise<boolean>((resolve) => {
                                setTimeout(() => {
                                    console.log('Timeout ao carregar carrinho local após erro, continuando...');
                                    resolve(false);
                                }, 3000);
                            });
                            
                            await Promise.race([loadPromise, loadTimeout]);
                        } catch (innerError) {
                            console.error('Erro ao carregar carrinho local após falha de sincronização:', innerError);
                        }
                    }
                    
                } else if (isLoggedIn) {
                    // Usuário já estava logado, apenas carregar do servidor com timeout
                    try {
                        const loadPromise = loadServerCart();
                        const loadTimeout = new Promise<boolean>((resolve) => {
                            setTimeout(() => {
                                console.log('Timeout ao carregar carrinho do servidor para usuário já logado, continuando...');
                                resolve(false);
                            }, 5000);
                        });
                        
                        await Promise.race([loadPromise, loadTimeout]);
                    } catch (error) {
                        console.error('Erro ao carregar carrinho do servidor para usuário já logado:', error);
                    }
                } else {
                    // Usuário não está logado, carregar do local com timeout
                    try {
                        const loadPromise = loadLocalCart();
                        const loadTimeout = new Promise<boolean>((resolve) => {
                            setTimeout(() => {
                                console.log('Timeout ao carregar carrinho local para usuário não logado, continuando...');
                                resolve(false);
                            }, 3000);
                        });
                        
                        await Promise.race([loadPromise, loadTimeout]);
                    } catch (error) {
                        console.error('Erro ao carregar carrinho local para usuário não logado:', error);
                    }
                }
            } catch (error) {
                console.error('Erro geral no processo de sincronização:', error);
            } finally {
                // Garantir que syncInProgress seja definido como false no final do processo
                setSyncInProgress(false);
            
            // Atualiza o estado anterior de login
            setPreviousLoginState(isLoggedIn);
                
                // Limpar o timeout se o processo terminar normalmente
                if (syncTimeout) {
                    clearTimeout(syncTimeout);
                    syncTimeout = null;
                }
                
                console.log('Sincronização de carrinho concluída.');
            }
        };
        
        syncCart();
        
        // Limpar o timeout se o componente for desmontado
        return () => {
            if (syncTimeout) {
                clearTimeout(syncTimeout);
            }
        };
    }, [isLoggedIn]);

    const debouncedSendCartToServer = (option, id) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
            sendCartToServer(option, id);
        }, 1000);
    };

    const sendCartLocalServer = () => {
        // Não enviar dados ao servidor se estiver em processo de sincronização ou não estiver logado
        if (syncInProgress || !isLoggedIn || cartItems.length === 0 || cartData.length === 0) {
            return;
        }

        console.log('Enviando carrinho local para o servidor...');

        // Primeiro, remover itens duplicados do carrinho local
        const uniqueCartItems: { [key: string]: { productId: number | string, quantity: number } } = {};
        
        cartData.forEach(item => {
            const produto = cartItems.find(p => p.id === (item.productId || item.id));
            if (!produto) return;
            
            const productId = produto.id.toString();
            
            if (!uniqueCartItems[productId]) {
                uniqueCartItems[productId] = {
                    productId: produto.id,
                    quantity: item.quantity || item.qty || 1
                };
            } else {
                // Se já existe um item com este productId, atualizar com a maior quantidade
                uniqueCartItems[productId].quantity = Math.max(
                    uniqueCartItems[productId].quantity,
                    item.quantity || item.qty || 1
                );
            }
        });
        
        const items = Object.values(uniqueCartItems);

        if (items.length === 0) {
            return;
        }

        // Enviar cada item individualmente para o endpoint correto
        const promises = items.map(cartItem => {
            return addToCartServer(cartItem)
        .then(response => {
            console.log('Resposta da atualização do carrinho:', response);
                return response;
        })
        .catch(error => {
            console.error('Erro ao atualizar carrinho no servidor:', error);
                throw error;
            });
        });

        // Aguardar todas as operações terminarem
        Promise.all(promises)
            .then(() => console.log('Todos os itens do carrinho foram enviados para o servidor com sucesso'))
            .catch(err => console.error('Erro ao enviar alguns itens para o servidor:', err));
    }

    const sendCartToServer = (option, id) => {
        // Não enviar dados ao servidor se estiver em processo de sincronização
        if (syncInProgress) return;

        if (cartData.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartData));
            Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
        } else {
            localStorage.removeItem('cart');
            Cookies.remove('cart');
        }
        
        if (isLoggedIn) {
            if (cartData.length === 0) {
                return;
            }
            
            const validCartData = cartData.filter(item => {
                const itemId = item.id || item.productId;
                return cartItems.some(product => product && (product.id == itemId || product.id == itemId));
            });
            
            if (validCartData.length === 0) {
                return;
            }

            const convertedCartData = validCartData.map(item => {
                const itemId = item.id || item.produto_id;
                const product = cartItems.find(p => p && (p.id == itemId || p.id == itemId));
                
                if (item.productId !== undefined) {
                    return {
                        productId: product ? product.id : item.productId,
                        quantity: item.quantity || 1,
                        price: getProductPrice(item)
                    };
                }

                return {
                    productId: product ? product.id : item.id,
                    quantity: item.qty || 1,
                    price: getProductPrice(item)
                };
            });

            switch (option) {
                case 1:
                    // Enviar produto individual para a API
                    const productToAdd = convertedCartData.find(item => item.productId == id);
                    if (productToAdd) {
                        addToCartServer(productToAdd)
                    .then(response => {
                            console.log('Resposta da adição ao carrinho:', response);
                    })
                    .catch(error => {
                            console.error('Erro ao adicionar ao carrinho no servidor:', error);
                    });
                    }
                    break;
                case 2:
                    removeFromCartServer(id)
                    .then(response => {
                        console.log('Resposta da remoção do carrinho:', response);
                    })
                    .catch(error => {
                        console.error('Erro ao remover do carrinho no servidor:', error);
                    });
                    break;
                case 3:
                    // Este caso não é mais necessário para atualizações de quantidade,
                    // pois agora estamos usando updateQuantityOnServer diretamente
                    // Mantemos apenas para compatibilidade com código existente
                    if (!isLoggedIn) {
                        const productToUpdate = convertedCartData.find(item => item.productId == id);
                        if (productToUpdate) {
                            cartUpdate({ item: productToUpdate }, id)
                    .then(response => {
                                console.log('Resposta da atualização de quantidade (método antigo):', response);
                    })
                    .catch(error => {
                                console.error('Erro ao atualizar quantidade no servidor:', error);
                    });
                        }
                    }
                    break;
            }
        }
    };

    // Função auxiliar para obter o preço do produto correspondente ao item do carrinho
    const getProductPrice = (item) => {
        const itemId = item.id || item.productId;
        const product = cartItems.find(p => p && p.id == itemId);
        
        if (product && product.price) {
            return product.price;
        }
        
        return 0;
    };

    // Nova função para adicionar um produto diretamente ao servidor
    const addProductToServer = async (item) => {
        // Verificar se o usuário está autenticado
        if (!isAuthenticated()) {
            console.log("Usuário não autenticado, não adicionando produto ao servidor");
            return;
        }
        
        try {
            console.log(`Enviando produto para o servidor: ${JSON.stringify(item)}`);
            
            // Evitar atualizações durante sincronização
            if (syncInProgress) {
                console.log("Processo de sincronização em andamento, adiando adição");
                setTimeout(() => addProductToServer(item), 1000);
                return;
            }
            
            const response = await addToCartServer(item);
            
            console.log("Resposta da adição ao carrinho:", response);
            
            // Verificar se a adição foi bem-sucedida
            if (response && (response.status >= 200 && response.status < 300)) {
                console.log(`Produto ${item.productId} adicionado ao servidor com sucesso`);
                return true;
            } else {
                console.error(`Erro ao adicionar produto ao servidor: ${response?.status || 'Desconhecido'}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar produto ao servidor:', error);
            
            // Tentar novamente se for um erro temporário (429, 500, etc.)
            if (error.response && (error.response.status >= 429 || error.response.status >= 500)) {
                console.log("Erro temporário, tentando novamente em 2 segundos...");
                setTimeout(() => addProductToServer(item), 2000);
            }
            return false;
        }
    }

    // Nova função para remover um produto diretamente do servidor
    const removeProductFromServer = async (productId) => {
        // Verificar se o usuário está autenticado
        if (!isAuthenticated()) {
            console.log("Usuário não autenticado, não removendo produto do servidor");
            return;
        }
        
        try {
            console.log(`Removendo produto do servidor: ${productId}`);
            
            // Evitar atualizações durante sincronização
            if (syncInProgress) {
                console.log("Processo de sincronização em andamento, adiando remoção");
                setTimeout(() => removeProductFromServer(productId), 1000);
                return;
            }
            
            const response = await removeFromCartServer(productId);
            
            console.log("Resposta da remoção do carrinho:", response);
            
            // Verificar se a remoção foi bem-sucedida
            if (response && (response.status >= 200 && response.status < 300)) {
                console.log(`Produto ${productId} removido do servidor com sucesso`);
                return true;
            } else {
                console.error(`Erro ao remover produto do servidor: ${response?.status || 'Desconhecido'}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao remover produto do servidor:', error);
            
            // Tentar novamente se for um erro temporário (429, 500, etc.)
            if (error.response && (error.response.status >= 429 || error.response.status >= 500)) {
                console.log("Erro temporário, tentando novamente em 2 segundos...");
                setTimeout(() => removeProductFromServer(productId), 2000);
            }
            return false;
        }
    }

    // Carrega o carrinho inicial
    useEffect(() => {
        const loadInitialCart = async () => {
            if (initialized) return; // Evitar inicialização múltipla
            
            console.log('Iniciando carregamento do carrinho...');
            
            // Verificar se há dados no localStorage antes de tudo
            const localStorageCart = localStorage.getItem('cart');
            console.log(`Verificando localStorage na inicialização: ${localStorageCart || 'Vazio'}`);
            
            try {
            if (isLoggedIn) {
                    console.log('Usuário está logado, tentando carregar carrinho do servidor...');
                const serverCartLoaded = await loadServerCart();
                
                if (!serverCartLoaded || cartItems.length === 0) {
                        console.log('Carrinho do servidor vazio ou falha no carregamento, tentando carregar do localStorage...');
                    const localCartLoaded = await loadLocalCart();
                        
                        if (localCartLoaded) {
                            console.log('Carrinho local carregado com sucesso, enviando para o servidor...');
                            // Se carregou localmente com sucesso, sincronizar com o servidor
                            if (cartData.length > 0) {
                                await sendCartLocalServer();
                            }
                        }
                    }
                } else {
                    console.log('Usuário não está logado, carregando apenas do localStorage...');
                    await loadLocalCart();
                    
                    // Verificar se o carregamento foi bem-sucedido
                    console.log(`Estado do carrinho após carregamento local: ${cartData.length} itens, ${cartItems.length} produtos`);
                }
                
                setInitialized(true);
            } catch (error) {
                console.error('Erro durante a inicialização do carrinho:', error);
            }
        };
        
        loadInitialCart();
    }, [isLoggedIn]);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart, removeItems }}>
        {children}
        </CartContext.Provider>
    );
};