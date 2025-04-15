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
import Cart from '../components/cart';
import Header from '../header';
import { useCart } from '../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography, Checkbox, FormControlLabel, FormGroup, Pagination, Switch } from '@mui/material';
import { useToastSide } from '../context/toastSide';
import Footer from '../footer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getProdsLimit, getProdutosCategoria, getProdutosFabricante } from '../services/produto/page';
import NoImage from "../assets/img/noimage.png";

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
        // Adicionando timestamp para evitar cache
        const timestamp = new Date().getTime();
        const resp = await getProdsLimit(limit, category, fabricante, page, timestamp);
        
        // Se a resposta já estiver no formato de array de itens
        if (Array.isArray(resp.data)) {
            const prodFormatted = resp.data.map((produto: any) => ({
                id: produto.id,
                pro_codigo: produto.id,
                name: produto.pro_desc_tecnica || produto.pro_descricao,
                pro_desc_tecnica: produto.pro_desc_tecnica || produto.pro_descricao,
                pro_descricao: produto.pro_descricao || produto.pro_desc_tecnica || '',
                img: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                imagens: produto.imagens || [],
                pro_imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                price: 'R$ '+(produto.pro_precovenda || 0).toFixed(2).replace('.', ','),
                pro_precovenda: produto.pro_precovenda || 0,
                pro_valorultimacompra: produto.pro_valorultimacompra || produto.pro_precovenda || 0,
                sku: produto.pro_partnum_sku || '',
                pro_partnum_sku: produto.pro_partnum_sku || '',
                cores: produto.cores || []
            }));
            
            return {
                items: prodFormatted,
                totalItems: resp.data.length,
                totalPages: 1,
                currentPage: page
            };
        }
        
        // Se a resposta estiver no formato paginado com items
        if (resp.data && resp.data.items) {
            const prodFormatted = resp.data.items.map((produto: any) => ({
                id: produto.id,
                pro_codigo: produto.id,
                name: produto.pro_desc_tecnica || produto.pro_descricao,
                pro_desc_tecnica: produto.pro_desc_tecnica || produto.pro_descricao,
                pro_descricao: produto.pro_descricao || produto.pro_desc_tecnica || '',
                img: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                imagens: produto.imagens || [],
                pro_imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                price: 'R$ '+(produto.pro_precovenda || 0).toFixed(2).replace('.', ','),
                pro_precovenda: produto.pro_precovenda || 0,
                pro_valorultimacompra: produto.pro_valorultimacompra || produto.pro_precovenda || 0,
                sku: produto.pro_partnum_sku || '',
                pro_partnum_sku: produto.pro_partnum_sku || '',
                cores: produto.cores || []
            }));
            
            return {
                items: prodFormatted,
                totalItems: resp.data.totalItems,
                totalPages: resp.data.totalPages,
                currentPage: resp.data.currentPage
            };
        }
        
        return {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1
        };
    } catch (error) {
        return {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1
        };
    }
};

const getProdutoCategory = async (limit: number) => {
    try {
        const resp = await getProdutosCategoria(limit);
        const prodFormatted = resp.data.map((produto: any) => ({
            id: produto.id,
            tpo_codigo: produto.tpo_codigo,
            tpo_descricao: produto.tpo_descricao,
        }));
        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
    }
};

const getProdutoFabricante = async (limit: number) => {
    try {
        const resp = await getProdutosFabricante(limit);
        const prodFormatted = resp.data.map((produto: any) => ({
            id: produto.id,
            fab_codigo: produto.fab_codigo,
            fab_descricao: produto.fab_descricao,
        }));
        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
    }
};


const ProductsPage = () => {
    const [openedCart, setOpenedCart] = useState(false);
    const [loadBtn, setLoadBtn] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [products, setProducts] = useState<{id: number, name: string; img: string; price: string; sku: string }[]>([]);
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const { codigo } = useParams();
    const [categories, setCategories] = useState<{id: number,tpo_codigo: number,tpo_descricao: string}[]>([]);
    const [fabricantes, setFabricantes] = useState<{id: number,fab_codigo: number,fab_descricao: string}[]>([]);
    const [catSett, setCatSett] = useState([]);
    const [fabSett, setFabSett] = useState([]);
    const [product, setProduct] = useState({
        pro_codigo: 54862,
        pro_descricao: 'DISCO FLAP 4 1/2" GRÃO 400',
        pro_valorultimacompra: 139.90,
        cores: []
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;
    
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
        const categoriasArray = category ? category.split(",").map(Number) : [];
        const fabricantesArray = fabricante ? fabricante.split(",").map(Number) : [];
        
        setCatSett(categoriasArray);
        setFabSett(fabricantesArray);
        setCurrentPage(page);
        setIsLoading(true);
        
        // Carregar dados diretamente do backend usando fetch
        const loadProductsDirectly = async () => {
            try {
                // Função para carregar produtos diretamente do backend
                const timestamp = new Date().getTime();
                const backendQueryUrl = `${backendUrl}/produtos?limit=${itemsPerPage}&page=${page}&_nocache=${timestamp}${category ? '&categoria='+category : ''}${buscaParams ? '&s='+buscaParams : ''}${fabricante ? '&fabricante='+fabricante : ''}`;
                
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
                
                if (data && data.items && data.items.length > 0) {
                    const formattedProducts = data.items.map((produto) => ({
                        id: produto.id,
                        pro_codigo: produto.id,
                        name: produto.pro_desc_tecnica || produto.pro_descricao,
                        pro_desc_tecnica: produto.pro_desc_tecnica || produto.pro_descricao,
                        pro_descricao: produto.pro_descricao || produto.pro_desc_tecnica || '',
                        img: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                        imagens: produto.imagens || [],
                        pro_imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                        price: 'R$ '+(produto.pro_precovenda || 0).toFixed(2).replace('.', ','),
                        pro_precovenda: produto.pro_precovenda || 0,
                        pro_valorultimacompra: produto.pro_valorultimacompra || produto.pro_precovenda || 0,
                        sku: produto.pro_partnum_sku || '',
                        pro_partnum_sku: produto.pro_partnum_sku || '',
                        cores: produto.cores || []
                    }));
                    
                    setProducts(formattedProducts);
                    setTotalPages(data.totalPages);
                    setTotalItems(data.totalItems);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                setProducts([]);
                
                // Fallback para o método original em caso de falha
                loadProductsData();
            } finally {
                setIsLoading(false);
            }
        };
        
        // Carregar categorias e fabricantes
        const loadCategories = async () => {
            const categories = await getProdutoCategory(10);
            setCategories(categories);
        };
        
        const loadFabricantes = async () => {
            const fabricantes = await getProdutoFabricante(10);
            setFabricantes(fabricantes);
        };
        
        // Executar carregamentos
        loadProductsDirectly();
        loadFabricantes();
        loadCategories();
    }, [page, category, fabricante]);

    const handleAtualizaFiltros = async () => {
        const url = new URL(window.location.href);
        
        setCurrentPage(1);
        url.searchParams.set('page', '1');
        
        if (catSett.length > 0) {
            url.searchParams.set('categoria', catSett.join(','));
        } else {
            url.searchParams.delete('categoria');
        }
        
        if (fabSett.length > 0) {
            url.searchParams.set('fabricante', fabSett.join(','));
        } else {
            url.searchParams.delete('fabricante');
        }
        
        window.history.pushState({}, '', url);
        
        const categoriaParam = catSett.length > 0 ? catSett.join(',') : null;
        const fabricanteParam = fabSett.length > 0 ? fabSett.join(',') : null;
        
        await loadProductsData(1, categoriaParam, fabricanteParam);
    };
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setCatSett((prev) =>
          event.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    const handleCheckboxChangeFab = (event: React.ChangeEvent<HTMLInputElement>, fab_codigo: number) => {
        setFabSett((prev) =>
          event.target.checked ? [...prev, fab_codigo] : prev.filter((item) => item !== fab_codigo)
        );
    };
    
    const handlePageChange = async (event, value) => {
        // Preparar os parâmetros de filtro
        const categoriaParam = catSett.length > 0 ? catSett.join(',') : category;
        const fabricanteParam = fabSett.length > 0 ? fabSett.join(',') : fabricante;
        
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
            const backendQueryUrl = `${backendUrl}/produtos?limit=${itemsPerPage}&page=${value}&_nocache=${timestamp}${categoriaParam ? '&categoria='+categoriaParam : ''}${fabricanteParam ? '&fabricante='+fabricanteParam : ''}`;
            
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
            
            // Debug: Verificar se os dados são diferentes para página 1 e 2
            if (value === 2) {
                // Fazer requisição para a página 1 para comparar
                const page1Data = await debugRequestToBackend(`${backendUrl}/produtos?limit=${itemsPerPage}&page=1&_t=${timestamp}${categoriaParam ? '&categoria='+categoriaParam : ''}${fabricanteParam ? '&fabricante='+fabricanteParam : ''}`);
            }
            
            if (data && data.items && data.items.length > 0) {
                const formattedProducts = data.items.map((produto) => ({
                    id: produto.id,
                    pro_codigo: produto.id,
                    name: produto.pro_desc_tecnica || produto.pro_descricao,
                    pro_desc_tecnica: produto.pro_desc_tecnica || produto.pro_descricao,
                    pro_descricao: produto.pro_descricao || produto.pro_desc_tecnica || '',
                    img: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                    imagens: produto.imagens || [],
                    pro_imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
                    price: 'R$ '+(produto.pro_precovenda || 0).toFixed(2).replace('.', ','),
                    pro_precovenda: produto.pro_precovenda || 0,
                    pro_valorultimacompra: produto.pro_valorultimacompra || produto.pro_precovenda || 0,
                    sku: produto.pro_partnum_sku || '',
                    pro_partnum_sku: produto.pro_partnum_sku || '',
                    cores: produto.cores || []
                }));
                
                // Forçar a atualização do estado imediatamente
                setProducts(formattedProducts);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalItems);
            } else {
                setProducts([]);
            }
        } catch (error) {
            setProducts([]);
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
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
            <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            <div className="container d-flex flex-wrap justify-content-center mt-3">
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
                                            {categories.map((c) => (
                                                <FormControlLabel 
                                                    key={c.id} 
                                                    control={
                                                        <Checkbox 
                                                            onChange={(event) => handleCheckboxChange(event, c.id)} 
                                                            checked={catSett.includes(c.id)} 
                                                            size='small' 
                                                        />
                                                    } 
                                                    label={c.tpo_descricao} 
                                                />
                                            ))}
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
                                            {fabricantes.map((f) => (
                                                <FormControlLabel 
                                                    key={f.fab_codigo} 
                                                    control={
                                                        <Checkbox 
                                                            onChange={(event) => handleCheckboxChangeFab(event, f.fab_codigo)} 
                                                            checked={fabSett.includes(f.fab_codigo)} 
                                                            size='small' 
                                                        />
                                                    } 
                                                    label={f.fab_descricao} 
                                                />
                                            ))}
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
                                <Image
                                        src={produto.img}
                                        width={200}
                                        height={200}
                                        alt="Produto"
                                        layout="responsive"
                                />
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
                                <a className='title-link-product' href={`/produto/${produto.id}`}>
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