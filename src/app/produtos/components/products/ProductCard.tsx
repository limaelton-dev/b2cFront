import Image from 'next/image';
import { Typography, CircularProgress } from '@mui/material';
import { Product } from '../../../api/products/types/product';
import NoImage from '../../../assets/img/noimage.png';

interface ProductCardProps {
    product: Product;
    loadingProducts: { [key: number]: boolean };
    handleAddToCart: (product: Product) => void;
    handleImageError: (event: any) => void;
}

export default function ProductCard({ product, loadingProducts, handleAddToCart, handleImageError }: ProductCardProps) {
    // Função para obter a imagem do produto
    const getProductImage = (product: Product) => {
        // Nova estrutura: usar a imagem principal ou a primeira imagem
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const mainImage = product.images.find(img => img.main) || product.images[0];
            if (mainImage) {
                return mainImage.standardUrl || mainImage.originalImage || mainImage.url;
            }
        }
        
        // Compatibilidade: estrutura antiga
        if (product.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
            return product.imagens[0].url;
        }

        if (product.pro_imagem) {
            return product.pro_imagem;
        }
        
        return NoImage.src;
    };

    // Função para obter o preço do produto
    const getProductPrice = (product: Product) => {
        // Nova estrutura: usar o preço do primeiro SKU ativo
        if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
            const activeSku = product.skus.find(sku => sku.active) || product.skus[0];
            if (activeSku && activeSku.price && !isNaN(Number(activeSku.price))) {
                return `R$ ${Number(activeSku.price).toFixed(2).replace('.', ',')}`;
            }
        }
        
        // Compatibilidade: usar campos antigos
        if (product.pro_precovenda && !isNaN(Number(product.pro_precovenda))) {
            return `R$ ${Number(product.pro_precovenda).toFixed(2).replace('.', ',')}`;
        }
        
        return 'Preço não disponível';
    };

    // Função para obter o nome do produto
    const getProductName = (product: Product) => {
        return product.title || product.name || "Produto";
    };

    return (
        <div className="product" key={product.slug}>
            <div className="wishlist-button"></div>
            <a href={`/produto/${product.slug}`}>
                <Image
                    src={getProductImage(product)}
                    width={200}
                    height={200}
                    alt={getProductName(product)}
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
                    {getProductName(product)}
                </Typography>
            </a>
            <div className="description">{product.model || product.description || ''}</div>
            <div className="price">
                {getProductPrice(product)}
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