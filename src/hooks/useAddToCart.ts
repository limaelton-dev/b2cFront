import { useState, useCallback } from 'react';
import { useCart } from '@/context/CartProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { Product } from '@/api/products/types/product';
import { getActiveSku } from '@/utils/product';

export function useAddToCart() {
    const { addItem } = useCart();
    const { showToast } = useToastSide();
    const [loadingProducts, setLoadingProducts] = useState<{ [key: number]: boolean }>({});

    const addToCart = useCallback(
        async (product: Product, options?: { onSuccess?: () => void }) => {
            setLoadingProducts(prev => ({ ...prev, [product.id]: true }));

            try {
                const activeSku = getActiveSku(product);

                if (!activeSku) {
                    showToast('Produto sem SKU disponível.', 'error');
                    return false;
                }

                await addItem(activeSku.id, product.id);
                showToast('Produto adicionado ao carrinho!', 'success');
                
                options?.onSuccess?.();
                return true;
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
                showToast('Erro ao adicionar produto ao carrinho.', 'error');
                return false;
            } finally {
                setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
            }
        },
        [addItem, showToast]
    );

    const addToCartWithSkuId = useCallback(
        async (skuId: number, productId: number, options?: { onSuccess?: () => void }) => {
            setLoadingProducts(prev => ({ ...prev, [productId]: true }));

            try {
                await addItem(skuId, productId);
                showToast('Produto adicionado ao carrinho!', 'success');
                
                options?.onSuccess?.();
                return true;
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
                showToast('Erro ao adicionar produto ao carrinho.', 'error');
                return false;
            } finally {
                setLoadingProducts(prev => ({ ...prev, [productId]: false }));
            }
        },
        [addItem, showToast]
    );

    const isProductLoading = useCallback(
        (productId: number) => loadingProducts[productId] || false,
        [loadingProducts]
    );

    return {
        addToCart,
        addToCartWithSkuId,
        loadingProducts,
        isProductLoading
    };
}

