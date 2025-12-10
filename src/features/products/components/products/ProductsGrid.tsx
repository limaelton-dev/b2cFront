import { CircularProgress, Typography } from '@mui/material';
import { Product } from '../../../api/products/types/product';
import ProductCard from './ProductCard';

interface ProductsGridProps {
    products: Product[];
    isLoading: boolean;
    loadingProducts: { [key: number]: boolean };
    handleAddToCart: (product: Product) => void;
    handleImageError: (event: any) => void;
}

export default function ProductsGrid({ products, isLoading, loadingProducts, handleAddToCart, handleImageError }: ProductsGridProps) {
    return (
        <div className='products' style={{width:'80%'}}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                    <CircularProgress size={60} />
                </div>
            ) : products ? (
                products.map((product) => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        loadingProducts={loadingProducts}
                        handleAddToCart={handleAddToCart}
                        handleImageError={handleImageError}
                    />
                ))
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                    <Typography variant="h6">Nenhum produto encontrado</Typography>
                </div>
            )}
        </div>
    );
}