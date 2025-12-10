import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/api/products/types/product';
import { fetchProductBySlug } from '@/api/products/services/product';
import { getActiveSku, getSkuById } from '@/utils/product';

export function useProductDetails(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProduct = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchProductBySlug(slug);
            setProduct(data);

            if (data?.skus && data.skus.length > 0) {
                const firstActiveSku = getActiveSku(data);
                if (firstActiveSku) {
                    setSelectedSkuId(firstActiveSku.id);

                    if (data.images?.length > 0) {
                        const firstVariation = firstActiveSku.variations?.[0]?.description;
                        const variationImage = data.images.find(
                            (image) => image.variation === firstVariation && image.main === true
                        );
                        const fallbackImage = data.images.find((image) => image.main === true);
                        setSelectedImageUrl(
                            variationImage?.url || fallbackImage?.url || data.images[0]?.url || ''
                        );
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao buscar produto:', err);
            setError('Erro ao carregar produto');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const getSelectedSku = useCallback(() => {
        if (!product) return null;
        return getSkuById(product, selectedSkuId);
    }, [product, selectedSkuId]);

    const getFilteredImages = useCallback(() => {
        if (!product?.images || product.images.length === 0) return [];

        const selectedSku = getSelectedSku();
        if (!selectedSku?.variations || selectedSku.variations.length === 0) {
            return product.images;
        }

        const variationDescription = selectedSku.variations[0].description;
        const variationImages = product.images.filter(
            (img) => img.variation === variationDescription
        );

        return variationImages.length > 0 ? variationImages : product.images;
    }, [product, getSelectedSku]);

    const changeVariation = useCallback(
        (variationValue: string) => {
            if (!product?.skus) return;

            const selectedSku = product.skus.find((sku) =>
                sku.variations?.some((v) => v.description === variationValue)
            );

            if (selectedSku) {
                setSelectedSkuId(selectedSku.id);

                if (product.images && product.images.length > 0) {
                    const variationImage = product.images.find(
                        (image) => image.variation === variationValue && image.main === true
                    );
                    const fallbackImage = product.images.find((image) => image.main === true);
                    setSelectedImageUrl(
                        variationImage?.url || fallbackImage?.url || product.images[0]?.url || ''
                    );
                }
            }
        },
        [product]
    );

    const changeImage = useCallback(
        (imageId: number) => {
            if (product?.images && product.images.length > 0) {
                const foundImage = product.images.find((image) => image.id === imageId);
                if (foundImage) {
                    setSelectedImageUrl(foundImage.url || foundImage.standardUrl || foundImage.originalImage || '');
                }
            }
        },
        [product]
    );

    return {
        product,
        selectedSkuId,
        selectedImageUrl,
        loading,
        error,
        getSelectedSku,
        getFilteredImages,
        changeVariation,
        changeImage,
        reload: loadProduct
    };
}

