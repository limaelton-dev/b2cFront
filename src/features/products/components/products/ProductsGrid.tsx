import { Box } from '@mui/material';
import { Product } from '@/api/products/types/product';
import { ProductCard, ProductCardSkeleton, ProductsEmptyState } from '@/components/ProductCard';

interface ProductsGridProps {
    products: Product[];
    isLoading: boolean;
    loadingProducts: { [key: number]: boolean };
    handleAddToCart: (product: Product) => void;
    hasError?: boolean;
    onRetry?: () => void;
}

export default function ProductsGrid({ 
    products, 
    isLoading, 
    loadingProducts, 
    handleAddToCart,
    hasError,
    onRetry,
}: ProductsGridProps) {
    const skeletonCount = 8;
    const hasProducts = products && products.length > 0;

    if (isLoading) {
        return (
            <Box
                sx={{
                    width: '80%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start',
                    px: 1,
                }}
            >
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <Box
                        key={`skeleton-${index}`}
                        sx={{
                            width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
                        }}
                    >
                        <ProductCardSkeleton />
                    </Box>
                ))}
            </Box>
        );
    }

    if (hasError) {
        return (
            <Box sx={{ width: '80%', px: 1 }}>
                <ProductsEmptyState 
                    type="error" 
                    onRetry={onRetry}
                    showBrowseButton={false}
                />
            </Box>
        );
    }

    if (!hasProducts) {
        return (
            <Box sx={{ width: '80%', px: 1 }}>
                <ProductsEmptyState 
                    type="no-results"
                    showRetryButton={false}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
                px: 1,
            }}
        >
            {products.map((product) => (
                <Box
                    key={product.id}
                    sx={{
                        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
                    }}
                >
                    <ProductCard
                        product={product}
                        isLoading={loadingProducts[product.id]}
                        onAddToCart={handleAddToCart}
                    />
                </Box>
            ))}
        </Box>
    );
}
