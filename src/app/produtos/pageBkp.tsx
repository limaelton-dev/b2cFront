"use client"
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import '../assets/css/produtos.css';
import Image from 'next/image';
import LogoColetek from '../assets/img/logo_coletek.png';
import HeadphoneImg from '../assets/img/headphone.png';
import BannerProd from '../assets/img/banner_mouse.png';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEffect, useState } from 'react';
import { getProduto } from '../services/produto/page';
import Cart from '../../components/cart';
import ClientOnly from '../../components/ClientOnly';
import Header from '../header';
import { useCart } from '../../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography, Checkbox, FormControlLabel, FormGroup, Pagination, Switch, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useToastSide } from '../../context/toastSide';
import Footer from '../footer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getProdsLimit, getProdutosCategoria, getProdutosFabricante, getProdutosFiltrados } from '../services/produto/page';
import NoImage from "../assets/img/noimage.png";
import { Product, ProductBrand, ProductCategory, ProductResponse, PaginatedResponse } from '../../types/produto';
import { fetchAllProducts } from '../services/product-service';

const isClient = typeof window !== 'undefined';
const backendUrl = isClient ? process.env.NEXT_PUBLIC_BACKEND_URL : 'http://localhost:3000';

const debugRequestToBackend = async (url) => {
    try {
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};

const clearProductCache = async () => {
    if (typeof window !== 'undefined') {
        const caches = await window.caches?.keys();
        if (caches) {
            for (const cache of caches) {
                await window.caches.delete(cache);
            }
        }
    }
};

const getProdutos = async (limit: number, category, fabricante, page = 1) => {
    try {
        // Nova abordagem de filtro usando os nomes das categorias e marcas
        const brandName = fabricante ? fabricante.toString() : '';
        const categoryName = category ? category.toString() : '';
        const resp = await getProdutosFiltrados(brandName, categoryName, page, limit, 'DESC');
        
        // Log para depuração
        console.log('Parâmetros do filtro:', { brandName, categoryName, page, limit });
        console.log('URL do filtro:', `category/filter?brandName=${brandName}&categoryName=${categoryName}&page=${page}&limit=${limit}&sortDirection=DESC`);
        
        // Verificar formato da resposta e extrair dados dos produtos
        if (resp.data && resp.data.data && Array.isArray(resp.data.data)) {
            const prodFormatted = resp.data.data.map(produto => formatProduct(produto));
            
            return {
                items: prodFormatted,
                totalItems: resp.data.meta?.total || prodFormatted.length,
                totalPages: resp.data.meta?.totalPages || 1,
                currentPage: resp.data.meta?.page || page
            };
        }
        
        return {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1
        };
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1
        };
    }
};

const getProdutoCategory = async () => {
    try {
        const resp = await getProdutosCategoria();
        console.log('Resposta completa de categorias:', resp);
        
        // Novo formato da resposta da API
        if (resp && resp.data) {
            // Garantir que estamos trabalhando com um array
            const categorias = Array.isArray(resp.data) ? resp.data : 
                               (resp.data.data && Array.isArray(resp.data.data)) ? resp.data.data : [];
            
            console.log('Categorias processadas:', categorias);
            
            const prodFormatted = categorias.map((categoria: any) => ({
                id: categoria.id,
                oracleId: categoria.oracleId,
                name: categoria.name,
                slug: categoria.slug,
                level: categoria.level || 1
            }));
            
            console.log('Categorias formatadas:', prodFormatted);
            return prodFormatted;
        }
        return [];
    } catch (error) {
        console.error('Erro ao obter categorias:', error);
        return [];
    }
};

const getProdutoFabricante = async () => {
    try {
        const resp = await getProdutosFabricante();
        console.log('Resposta completa de marcas:', resp);
        
        // Novo formato da resposta da API
        if (resp && resp.data) {
            // Garantir que estamos trabalhando com um array
            const marcas = Array.isArray(resp.data) ? resp.data : 
                          (resp.data.data && Array.isArray(resp.data.data)) ? resp.data.data : [];
            
            console.log('Marcas processadas:', marcas);
            
            const prodFormatted = marcas.map((marca: any) => ({
                brand: {
                    id: marca.id,
                    oracleId: marca.oracleId,
                    name: marca.name,
                    slug: marca.slug
                }
            }));
            
            console.log('Marcas formatadas:', prodFormatted);
            return prodFormatted;
        }
        return [];
    } catch (error) {
        console.error('Erro ao obter marcas:', error);
        return [];
    }
};

// Adicionar função para lidar com erros de imagem
const handleImageError = (event) => {
    console.log('Erro ao carregar imagem, usando imagem padrão');
    event.target.src = NoImage.src;
};

// Função única para processar imagens de produtos
const processProductImage = (produto) => {
    let mainImage = "";
    if (produto.images && Array.isArray(produto.images) && produto.images.length > 0) {
        // Primeiro tenta encontrar a imagem principal
        const mainImg = produto.images.find(img => img.isMain);
        if (mainImg && mainImg.url) {
            mainImage = mainImg.url;
        } else if (produto.images[0] && produto.images[0].url) {
            // Se não encontrar imagem principal, usa a primeira
            mainImage = produto.images[0].url;
        }
        
        // Verificar se a URL é válida
        if (!mainImage || !mainImage.startsWith('http')) {
            mainImage = NoImage.src;
        }
    } else {
        mainImage = NoImage.src;
    }
    return mainImage;
};

// Função para formatar produto
const formatProduct = (produto) => {
    return {
        id: produto.id,
        pro_codigo: produto.reference || produto.oracleId,
        pro_descricao: produto.name,
        pro_desc_tecnica: produto.techDescription,
        pro_precovenda: produto.price,
        pro_url_amigavel: produto.slug,
        imagens: produto.images,
        name: produto.name,
        img: processProductImage(produto),
        price: produto.price ? `R$ ${produto.price.replace('.', ',')}` : 'Preço indisponível',
        sku: produto.model || produto.sku,
        brand: produto.brand,
        categoryLevel1: produto.categoryLevel1,
        categoryLevel2: produto.categoryLevel2,
        categoryLevel3: produto.categoryLevel3
    };
};

const ProductsPage = () => {
    const [openedCart, setOpenedCart] = useState(false);
    const [loadBtn, setLoadBtn] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [products, setProducts] = useState<{id: number, name: string; pro_url_amigavel: string; img: string; price: string; sku: string }[]>([]);
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const { codigo } = useParams();
    const [categories, setCategories] = useState<{id: number, name: string, slug: string, level: number}[]>([]);
    const [fabricantes, setFabricantes] = useState<ProductResponse[]>(null);
    const [catSett, setCatSett] = useState([]);
    const [fabSett, setFabSett] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;  // Quantidade padrão de itens por página em todas as chamadas
    
    const searchParams = useSearchParams();

    const category = searchParams.get("categoria");
    const fabricante = searchParams.get("fabricante");
    const offer = searchParams.get("offer");
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : 1;
    const buscaParams = searchParams.get("s");

    const loadProductsData = async (pageNum = page, cat = category, fab = fabricante) => {
        setIsLoading(true);
        
        try {
            const result = await getProdutos(itemsPerPage, cat, fab, pageNum);
            
            setProducts(result.items);
            setTotalPages(result.totalPages);
            setTotalItems(result.totalItems);
            setCurrentPage(result.currentPage);
        } catch (error) {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Processar os parâmetros da URL
        const categoriasArray = category ? category.split(",").map(cat => decodeURIComponent(cat.trim())) : [];
        const fabricantesArray = fabricante ? fabricante.split(",").map(fab => decodeURIComponent(fab.trim())) : [];
        
        console.log('Parâmetros iniciais da URL (processados):', {
            categoriasArray,
            fabricantesArray,
            page,
            search: buscaParams
        });
        
        setCatSett(categoriasArray);
        setFabSett(fabricantesArray);
        setCurrentPage(page);
        setIsLoading(true);
        
        // Carregar dados diretamente do backend usando fetch
        const loadProductsDirectly = async () => {
            try {
                // Função para carregar produtos diretamente do backend
                const timestamp = new Date().getTime();
                const brandName = fabricante ? fabricante.toString() : '';
                const categoryName = category ? category.toString() : '';
                
                // Log para depuração
                console.log('Parâmetros diretos do filtro:', { brandName, categoryName, page });
                
                const backendQueryUrl = `${backendUrl}/category/filter?page=${page}&limit=${itemsPerPage}${buscaParams ? '&s='+buscaParams : ''}${brandName ? '&brandName='+encodeURIComponent(brandName) : ''}${categoryName ? '&categoryName='+encodeURIComponent(categoryName) : ''}&sortDirection=DESC&_nocache=${timestamp}`;
                
                console.log('URL direta do filtro:', backendQueryUrl);
                
                const response = await fetch(backendQueryUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erro na requisição inicial: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Resposta direta da API filter:', data);
                
                // Processar a resposta da API
                if (data && data.data && Array.isArray(data.data)) {
                    const formattedProducts = data.data.map(produto => formatProduct(produto));
                    
                    setProducts(formattedProducts);
                    setTotalPages(data.meta?.totalPages || 1);
                    setTotalItems(data.meta?.total || formattedProducts.length);
                    setCurrentPage(data.meta?.page || page);
                } else {
                    setProducts([]);
                    setTotalPages(1);
                    setTotalItems(0);
                }
            } catch (error) {
                console.error('Erro ao carregar produtos diretamente:', error);
                setProducts([]);
                
                // Fallback para o método original em caso de falha
                loadProductsData();
            } finally {
                setIsLoading(false);
            }
        };
        
        // Carregar categorias e fabricantes
        const loadCategories = async () => {
            try {
                const categories = await getProdutoCategory();
                console.log('Categorias carregadas para o state:', categories);
                setCategories(categories);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                setCategories([]);
            }
        };
        
        const loadFabricantes = async () => {
            try {
                const fabricantes = await getProdutoFabricante();
                console.log('Fabricantes carregados para o state:', fabricantes);
                setFabricantes(fabricantes);
            } catch (error) {
                console.error('Erro ao carregar fabricantes:', error);
                setFabricantes([]);
            }
        };

        const loadProductsAnymarket = async () => {
            try {
                const responseListProducts = await fetchAllProducts();
                console.log("ANYMARKET PRODUCTS:: ", responseListProducts);
            } catch (e) {
                console.log('deu pau: ', e)
            }
        }
        
        loadProductsAnymarket();
        // Executar carregamentos
        // loadProductsDirectly();
        // loadFabricantes();
        // loadCategories();
    }, [page, category, fabricante]);

    useEffect(() => {
        console.log('Categorias armazenadas no filtro:', catSett);
        console.log('Fabricantes armazenados no filtro:', fabSett);
    }, [catSett, fabSett]);

    const handleAtualizaFiltros = async () => {
        const url = new URL(window.location.href);
        
        setCurrentPage(1);
        url.searchParams.set('page', '1');
        
        // Filtros usando nomes de categorias e marcas
        const categoriasSelecionadas = catSett.length > 0 ? catSett.map(cat => encodeURIComponent(cat)).join(',') : '';
        const fabricantesSelecionados = fabSett.length > 0 ? fabSett.map(fab => encodeURIComponent(fab)).join(',') : '';
        
        console.log('Filtros aplicados:', {
            categorias: catSett,
            fabricantes: fabSett,
            categoriasSelecionadas,
            fabricantesSelecionados
        });
        
        if (categoriasSelecionadas) {
            url.searchParams.set('categoria', categoriasSelecionadas);
        } else {
            url.searchParams.delete('categoria');
        }
        
        if (fabricantesSelecionados) {
            url.searchParams.set('fabricante', fabricantesSelecionados);
        } else {
            url.searchParams.delete('fabricante');
        }
        
        window.history.pushState({}, '', url);
        
        await loadProductsData(1, categoriasSelecionadas, fabricantesSelecionados);
    };
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, categoryName: string) => {
        setCatSett((prev) =>
          event.target.checked ? [...prev, categoryName] : prev.filter((item) => item !== categoryName)
        );
    };

    const handleCheckboxChangeFab = (event: React.ChangeEvent<HTMLInputElement>, brandName: string | undefined) => {
        if (brandName === undefined) return;
        setFabSett((prev) =>
          event.target.checked ? [...prev, brandName] : prev.filter((item) => item !== brandName)
        );
    };
    
    const handlePageChange = async (event, value) => {
        // Preparar os parâmetros de filtro
        const categoriaParam = catSett.length > 0 ? catSett.join(',') : category || '';
        const fabricanteParam = fabSett.length > 0 ? fabSett.join(',') : fabricante || '';
        
        console.log('Parâmetros de filtro para paginação:', {
            categoriaParam,
            fabricanteParam,
            page: value
        });
        
        // Forçar uma limpeza dos produtos para indicar carregamento
        setProducts([]);
        setIsLoading(true);
        
        // Atualizar a página atual
        setCurrentPage(value);
        
        // Construir a URL com os parâmetros atuais
        const url = new URL(window.location.href);
        url.searchParams.set('page', value.toString());
        
        // Preservar os filtros na URL
        if (categoriaParam) {
            url.searchParams.set('categoria', categoriaParam);
        } else {
            url.searchParams.delete('categoria');
        }
        
        if (fabricanteParam) {
            url.searchParams.set('fabricante', fabricanteParam);
        } else {
            url.searchParams.delete('fabricante');
        }
        
        // Atualizar URL sem recarregar a página
        window.history.pushState({}, '', url);
        
        try {
            // Tentar limpar o cache do navegador
            await clearProductCache();
            
            // Fazer requisição direta ao backend com opções anti-cache
            const timestamp = new Date().getTime();
            const brandName = fabricanteParam ? fabricanteParam.toString() : '';
            const categoryName = categoriaParam ? categoriaParam.toString() : '';
            
            console.log('Parâmetros de paginação para a API:', { brandName, categoryName, page: value });
            
            const backendQueryUrl = `${backendUrl}/category/filter?page=${value}&limit=${itemsPerPage}${buscaParams ? '&s='+buscaParams : ''}${brandName ? '&brandName='+encodeURIComponent(brandName) : ''}${categoryName ? '&categoryName='+encodeURIComponent(categoryName) : ''}&sortDirection=DESC&_nocache=${timestamp}`;
            
            console.log('URL de paginação:', backendQueryUrl);
            
            const response = await fetch(backendQueryUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Processar a resposta da API
            if (data && data.data && Array.isArray(data.data)) {
                const formattedProducts = data.data.map(produto => formatProduct(produto));
                
                // Forçar a atualização do estado imediatamente
                setProducts(formattedProducts);
                setTotalPages(data.meta?.totalPages || 1);
                setTotalItems(data.meta?.total || formattedProducts.length);
            } else {
                setProducts([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Erro ao carregar produtos por paginação:', error);
            setProducts([]);
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddToCart = async (produto) => {
        setLoadingProducts(prev => ({ ...prev, [produto.id]: true }));
        
        if(!addToCart(produto, null)) {
            showToast('O produto já existe no carrinho!','error');
            setLoadingProducts(prev => ({ ...prev, [produto.id]: false }));
        }
        else {
            setTimeout(() => {
                setLoadingProducts(prev => ({ ...prev, [produto.id]: false }));
                showToast('O produto foi adicionado ao carrinho!','success');
                setOpenedCart(true);
            }, 500);
        }
    }

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>
            <div className="container d-flex flex-wrap justify-content-center mt-3">
                <div className="w-100 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="inherit"
                            href="/"
                        >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Link>
                        <Typography
                            sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        >
                            Produtos
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div style={{width:'20%'}}>
                    <div className="filtros-bg" style={{borderRadius: '6px', border: '1px solid #c1c1c1'}}>
                        <div className="filtros">
                            <h4 className='text-left mb-3 title-filtros'>Filtros</h4>
                            <div className="filtro">
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Categorias</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            {Array.isArray(categories) && categories.length > 0 ? (
                                                categories.map((c) => (
                                                    <FormControlLabel 
                                                        key={c.id || `cat-${Math.random()}`} 
                                                        control={
                                                            <Checkbox 
                                                                onChange={(event) => handleCheckboxChange(event, c.name)} 
                                                                checked={catSett.includes(c.name)} 
                                                                size='small' 
                                                            />
                                                        } 
                                                        label={c.name || 'Categoria sem nome'} 
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2">Carregando categorias...</Typography>
                                            )}
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Marcas</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            {Array.isArray(fabricantes) && fabricantes.length > 0 ? (
                                                fabricantes.map((f) => (
                                                    <FormControlLabel 
                                                        key={f.brand?.id || `brand-${Math.random()}`} 
                                                        control={
                                                            <Checkbox 
                                                                onChange={(event) => handleCheckboxChangeFab(event, f.brand?.name)} 
                                                                checked={fabSett.includes(f.brand?.name)} 
                                                                size='small' 
                                                            />
                                                        } 
                                                        label={f.brand?.name || 'Marca sem nome'} 
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2">Carregando marcas...</Typography>
                                            )}
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Mais Opções</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup sx={{display: 'flex', justifyContent: 'flex-start'}}>
                                            <FormControlLabel control={<Switch defaultChecked={false} />} labelPlacement="start" label="Frete Grátis" />
                                            <FormControlLabel control={<Switch defaultChecked={offer == 'sim'} />} labelPlacement="start" label="Promoção" />
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <div style={{padding: '10px'}}>
                                    <button type='button' onClick={handleAtualizaFiltros} className='refreshFillters'>Atualizar Filtros</button>
                                    {process.env.NODE_ENV === 'development' && (
                                        <button 
                                            type='button' 
                                            onClick={() => {
                                                console.log('=== DEBUG ===');
                                                console.log('Categorias:', categories);
                                                console.log('Fabricantes:', fabricantes);
                                                console.log('Seleção de categorias:', catSett);
                                                console.log('Seleção de fabricantes:', fabSett);
                                                console.log('=============');
                                                alert('Dados de debug exibidos no console');
                                            }} 
                                            className='refreshFillters'
                                            style={{marginTop: '10px', background: '#333'}}
                                        >
                                            Debug
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='products' style={{width:'80%'}}>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                            <CircularProgress size={60} />
                        </div>
                    ) : products.length > 0 ? (
                        products.map((produto) => (
                            <div className="product" key={produto.id}>
                                <div className="wishlist-button">
                
                                </div>
                                <a href={`/produto/${produto.pro_url_amigavel}`}>
                                    <Image
                                            src={produto.img || NoImage.src}
                                            width={200}
                                            height={200}
                                            alt={produto.name || "Produto"}
                                            unoptimized={true}
                                            onError={handleImageError}
                                    />
                                </a>
                                <div className="promo green">
                                    Até 20% OFF
                                </div>
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
                                <a className='title-link-product' href={`/produto/${produto.pro_url_amigavel}`}>
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
                                        {produto.name}
                                    </Typography>
                                </a>
                                <div className="description">
                                    {produto.sku}
                                </div>
                                <div className="price">
                                    {produto.price}
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                                <div className='addToCartBox d-flex justify-content-center'>
                                    <button 
                                        type='button' 
                                        className='addToCartButton'
                                        onClick={() => handleAddToCart(produto)}
                                        disabled={loadingProducts[produto.id]}
                                    >
                                        {loadingProducts[produto.id] ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            'Adicionar ao carrinho'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                            <Typography variant="h6">Nenhum produto encontrado</Typography>
                        </div>
                    )}
                </div>
                <div style={{width: '100%', margin: '15px', display: 'flex', justifyContent: 'center'}}>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </div>
            </div>
            <Footer/>
        </>
    )
};
export default ProductsPage;