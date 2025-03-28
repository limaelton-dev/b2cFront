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

const getProdutos = async (limit: number, category, fabricante) => {
    try {
        const resp = await getProdsLimit(limit, category, fabricante);
        const prodFormatted = resp.data.map((produto: any) => ({
            id: produto.id,
            pro_codigo: produto.id,
            name: produto.pro_desc_tecnica,
            pro_desc_tecnica: produto.pro_desc_tecnica,
            pro_descricao: produto.pro_descricao || produto.pro_desc_tecnica,
            img: produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
            imagens: produto.imagens,
            pro_imagem: produto.imagens.length > 0 ? produto.imagens[0].url : NoImage,
            price: 'R$ '+produto.pro_precovenda.toFixed(2).replace('.', ','),
            pro_precovenda: produto.pro_precovenda,
            pro_valorultimacompra: produto.pro_valorultimacompra || produto.pro_precovenda,
            sku: produto.pro_partnum_sku,
            pro_partnum_sku: produto.pro_partnum_sku,
            cores: produto.cores || []
        }));
        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
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
    const searchParams = useSearchParams();

    const category = searchParams.get("categoria");
    const fabricante = searchParams.get("fabricante");
    const offer = searchParams.get("offer");

    useEffect(() => {
        const loadProdutos = async () => {
            const products = await getProdutos(12,category,fabricante);
            setProducts(products);
        };
        const loadCategories = async () => {
            const categories = await getProdutoCategory(10);
            setCategories(categories);
        };
        const loadFabricantes = async () => {
            const fabricantes = await getProdutoFabricante(10);
            setFabricantes(fabricantes);
        };
        if (category) {
            const categoriasArray = category.split(",").map(Number);
            setCatSett(categoriasArray);
        }
        loadFabricantes();
        loadProdutos();
        loadCategories()
    },[]);

    const handleAtualizaFiltros = async () => {
        const atualizaProdutos = async () => {
            const products = await getProdutos(12,catSett.join(','), fabSett.join(','));
            setProducts(products);
        };
        atualizaProdutos();
    }
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setCatSett((prev) =>
          event.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    const handleCheckboxChangeFab = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setFabSett((prev) =>
          event.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
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
                                                <>
                                                    <FormControlLabel key={c.id} control={<Checkbox onChange={(event) => handleCheckboxChange(event, c.id)} checked={catSett.includes(c.id)} size='small' />} label={c.tpo_descricao} />
                                                </>
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
                                                <>
                                                    <FormControlLabel key={f.id} control={<Checkbox onChange={(event) => handleCheckboxChangeFab(event, f.id)} checked={fabSett.includes(f.id)} size='small' />} label={f.fab_descricao} />
                                                </>
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
                    {products.map((produto) => (
                        <div className="product">
                            <div className="wishlist-button">
            
                            </div>
                            <Image
                                    src={produto.img}
                                    width={200}
                                    height={200}
                                    alt="Headphone"
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
                    ))}
                </div>
                <div style={{width: '100%', margin: '15px', display: 'flex', justifyContent: 'center'}}>
                    <Pagination count={10}  />
                </div>
            </div>
            <Footer/>
        </>
    )
};
export default ProductsPage;