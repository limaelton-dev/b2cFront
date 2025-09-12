import Image from 'next/image';
import { Typography, CircularProgress } from '@mui/material';
import { Product } from '../../../types/product';
import NoImage from '../../../assets/img/noimage.png';

interface ProductCardProps {
    product: Product;
    loadingProducts: { [key: number]: boolean };
    handleAddToCart: (product: Product) => void;
    handleImageError: (event: any) => void;
}

export default function ProductCard({ product, loadingProducts, handleAddToCart, handleImageError }: ProductCardProps) {
    return (
        <div className="product" key={product.slug}>
            <div className="wishlist-button"></div>
            <a href={`/produto/${product.slug}`}>
                <Image
                    src={product.images[0]?.url ?? NoImage.src}
                    width={200}
                    height={200}
                    alt={product.title || "Produto"}
                    unoptimized={true}
                    onError={handleImageError}
                />
            </a>
            <div className="promo green">Até 20% OFF</div>
            <div className="promo-rating">
                <div className="colors">
                    <div className="color red"></div>
                    <div className="color black"></div>
                    <div className="color white"></div>
                </div>
                <div className="rating">
                    4.7
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F6B608">
                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                    </svg>
                </div>
            </div>
            <a className='title-link-product' href={`/produto/${product.slug}`}>
                <Typography
                    variant="body1"
                    className='title-product'
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                    }}
                >
                    {product.title}
                </Typography>
            </a>
            <div className="description">{product.model}</div>
            <div className="price">
                {product.skus.price}
                <div className="discount">(5% OFF)</div>
            </div>
            <div className='addToCartBox d-flex justify-content-center'>
                <button 
                    type='button' 
                    className='addToCartButton'
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingProducts[product.id]}
                >
                    {loadingProducts[product.id] ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        'Adicionar ao carrinho'
                    )}
                </button>
            </div>
        </div>
    );
}