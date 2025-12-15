import { Box, Typography } from '@mui/material';
import { Product } from '@/api/products/types/product';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';

interface ProductsGridProps {
    products: Product[];
    isLoading: boolean;
    loadingProducts: { [key: number]: boolean };
    handleAddToCart: (product: Product) => void;
    handleImageError?: (event: any) => void;
}

export default function ProductsGrid({ 
    products, 
    isLoading, 
    loadingProducts, 
    handleAddToCart 
}: ProductsGridProps) {
    const skeletonCount = 8;

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
            {isLoading ? (
                Array.from({ length: skeletonCount }).map((_, index) => (
                    <Box
                        key={`skeleton-${index}`}
                        sx={{
                            width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
                        }}
                    >
                        <ProductCardSkeleton />
                    </Box>
                ))
            ) : products && products.length > 0 ? (
                products.map((product) => (
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
                ))
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 6 }}>
                    <Typography variant="h6" color="text.secondary">
                        Nenhum produto encontrado
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
