"use client"
import React from 'react';
import '../assets/css/produtos.css';
import { useEffect, useState } from 'react';
import Cart from '../components/cart';
import ClientOnly from '../components/ClientOnly';
import Header from '../header';
import { useCart } from '../context/cart';
import { Pagination } from '@mui/material';
import { useToastSide } from '../context/toastSide';
import Footer from '../footer';
import NoImage from "../assets/img/noimage.png";
import { fetchAllProducts } from '../services/product-service';
import { ProductsPagineted } from '../types/products-pagineted';
import { Product } from '../types/product';
import ProductsGrid from './components/products/ProductsGrid';
import FiltersContainer from './components/filters/FiltersContainer';
import BreadCrumbsPage from './components/breadcrumbs/BreadCrumbsPage';
import { fetchRootCategories } from '../services/category';
import { fetchBrands } from '../services/brand';

const getProducts = async (filters = {}, pagination = {}) => {
    try {
        const dataProducts: Promise<ProductsPagineted> = await fetchAllProducts();
        return dataProducts;
    } catch (e) {
        console.log('deu pau: ', e)
    }
};

const getProductUrlImages = (products: Product[]) => {

}

// Função para lidar com erros de imagem
const handleImageError = (event) => {
    console.log('Erro ao carregar imagem, usando imagem padrão');
    event.target.src = NoImage.src;
};


const ProductsPage = () => {
    const [openedCart, setOpenedCart] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;

    const loadProducts = async () => {
        setIsLoading(true);
        
        try {
            const paginetedProducts: ProductsPagineted = await getProducts();

            setProducts(paginetedProducts.items);
            setTotalPages(paginetedProducts.lastPage);
            setTotalItems(paginetedProducts.totalMatched);
            setCurrentPage(paginetedProducts.currentPage);
        } catch (error) {
            console.log('Deu algum erro: ', error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        loadProducts();
    }, []);
    
    
    const handlePageChange = async (event, value) => {

    };
    
    const handleAddToCart = async (produto) => {

    }

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>
            <div className="container d-flex flex-wrap justify-content-center mt-3">
                <BreadCrumbsPage/>
                <FiltersContainer />
                <ProductsGrid 
                    products={products}
                    isLoading={isLoading}
                    loadingProducts={loadingProducts}
                    handleAddToCart={handleAddToCart}
                    handleImageError={handleImageError}
                />
                {/* Botões de paginação */}
                <div style={{width: '100%', margin: '15px', display: 'flex', justifyContent: 'center'}}>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </div>
            </div>
            <Footer/>
        </>
    )
};
export default ProductsPage;