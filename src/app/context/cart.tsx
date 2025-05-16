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
        const itemExists = cartItems.some(item => 
            item.id === product.id
        );

        if(itemExists) {
            return false;
        }

        const productId = product.id;
        
        if (!productId) {
            return false;
        }

        // Verificar se o produto tem preço válido
        if (!product.price) {
            return false;
        }

        // Adicionar o produto ao carrinho
        setCartData((prevItems) => {
            if (!Array.isArray(prevItems)) {
                return [{
                    productId: productId,
                    quantity: 1,
                }];
            }
            return [...prevItems, {
                productId: productId,
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
            item => !((item.id === id || item.productId === id))
        );
        setCartData(updatedCartData);
    
        const hasOtherItemsWithSameId = updatedCartData.some(
            item => item.id === id || item.productId === id
        );
        if (!hasOtherItemsWithSameId) {
            setCartItems(cartItems.filter(item => !(item.id === id || item.id === id)));
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
            if (item.id === id || item.productId === id) {
                if (item.id !== undefined) {
                    return { ...item, qty: newQty };
                }
                // Se o item tem o formato novo (produto_id, quantity)
                else if (item.productId !== undefined) {
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
            const cart = await getCart();
            
            if (cart && cart.data) {
                
                // Verificar se cart.data.cart_data existe e tem itens
                if (cart.data.cart_data && Array.isArray(cart.data.cart_data) && cart.data.cart_data.length > 0) {
                    const cartdata = cart.data as CartDataDto;
                    
                    try {
                        // Extrair os IDs dos produtos para buscar detalhes completos
                        const productIds = cartdata.cart_data.map(item => item.productId);

                        if (productIds.length === 0) {
                            return false;
                        }
                        
                        // Buscar detalhes completos dos produtos
                        const productsResponse = await getProdsArr(productIds);
                        
                        if (productsResponse && productsResponse.data && Array.isArray(productsResponse.data) && productsResponse.data.length > 0) {
                            
                            // Processar as imagens para cada produto
                            const processedProducts = productsResponse.data.map(product => {
                                return product;
                            });
                            
                            
                            // Converter os itens do carrinho para o formato antigo para manter compatibilidade
                            const convertedCartData = cartdata.cart_data.map(item => {
                                // Encontrar o produto correspondente
                                const product = processedProducts.find(p => p.id == item.productId || p.id == item.productId);
                                
                                return {
                                    id: product ? product.id : item.productId, // Usar o ID do produto, não o pro_codigo
                                    qty: item.quantity,
                                    // Não usamos mais o preço do carrinho, apenas a quantidade
                                };
                            });
                            
                            setCartItems(processedProducts);
                            setCartData(convertedCartData);
                            localStorage.setItem('cart', JSON.stringify(convertedCartData));
                            return true;
                        } else {
                            return false;
                        }
                    } catch (error) {
                        console.error('Erro ao processar produtos do carrinho:', error);
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
                
                const serverCartLoaded = await loadServerCart();
                
                if (!serverCartLoaded) {
                    const hasLocalCart = await loadLocalCart();
                    
                    if (hasLocalCart && cartData.length > 0) {
                        await sendCartToServer();
                    }
                }
            } else if (isLoggedIn) {
                await loadServerCart();
            } else {
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
            
            
            cartUpdate({ cart_data: convertedCartData })
                .then(response => {
                    console.log('Resposta da atualização do carrinho:', response);
                })
                .catch(error => {
                    console.error('Erro ao atualizar carrinho no servidor:', error);
                });
        }
    };

    // Função auxiliar para obter o preço do produto correspondente ao item do carrinho
    const getProductPrice = (item) => {
        const itemId = item.id || item.productId;
        const product = cartItems.find(p => p && (p.id == itemId || p.id == itemId));
        
        if (product && product.price) {
            return product.price;
        }
        
        return 0;
    };

    useEffect(() => {
        debouncedSendCartToServer();
    }, [cartData]);

    // Carrega o carrinho inicial
    useEffect(() => {
        const loadInitialCart = async () => {
            
            if (isLoggedIn) {
                const serverCartLoaded = await loadServerCart();
                
                if (!serverCartLoaded || cartItems.length === 0) {
                    const localCartLoaded = await loadLocalCart();
                    
                    if (localCartLoaded && cartItems.length > 0) {
                        await sendCartToServer();
                    }
                }
            } else {
                await loadLocalCart();
            }
            
        };
        
        loadInitialCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartData, changeQtyItem, addToCart, removeFromCart, removeItems }}>
        {children}
        </CartContext.Provider>
    );
};