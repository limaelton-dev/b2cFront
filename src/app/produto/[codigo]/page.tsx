"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import '../../assets/css/produto.css';
import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek.png';
import HeadphoneImg from '../../assets/img/headphone.png';
import BannerProd from '../../assets/img/banner_mouse.png';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEffect, useState } from 'react';
import { getProdsLimit, getProduto } from '../../services/produto/page';
import Cart from '../../components/cart';
import Header from '../../header';
import { useCart } from '../../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography, TextField, Checkbox, Breadcrumbs, Link } from '@mui/material';
import { useToastSide } from '../../context/toastSide';
import ScrollTopButton from '../../components/scrollTopButton';
import useScrollToDiv from '../../components/useScrollToDiv';
import Footer from '../../footer';
import { Carousel } from 'primereact/carousel';
import ReactInputMask from 'react-input-mask';
import axios from 'axios';
import { valorFreteDeslogado } from '../../services/checkout';
import HomeIcon from '@mui/icons-material/Home';

const getProdutosPage = async (limit: number) => {
    try {
        const resp = await getProdsLimit(limit);
        const prodFormatted = resp.data.data.map((produto: any) => ({
            id: produto.id,
            pro_codigo: produto.id,
            pro_descricao: produto.name,
            techDescription: produto.techDescription,
            pro_precovenda: produto.price,
            pro_url_amigavel: produto.slug,
            images: produto.images,
            name: produto.techDescription,
            img: produto.images && produto.images.length > 0 ? produto.images[0].url : "",
            preco: produto.price ? `R$ ${produto.price.replace('.', ',')}` : 'Preço indisponível',
            model: produto.model,
            reference: produto.reference,
            brand: produto.brand,
            description: produto.description,
            packagingContent: produto.packagingContent,
            barcode: produto.barcode
        }));

        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
    }
};

const ProductPage = () => {
    const offsetTop = useState(0);
    const scrollTo = useScrollToDiv();
    const { showToast } = useToastSide();
    const { addToCart, cartItems, cartData } = useCart();
    const [loadBtn, setLoadBtn] = useState(false);
    const [isPromoProd, setIsPromoProd] = useState(false);
    const [selectedImg, setSelectedImg] = useState('');
    const [cep, setCep] = useState('');
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const [loadingProduct, setLoadingProduct] = useState<number | null>(null);
    const [prodsRelation, setProdsRelation] = useState<object[]>([]);
    const [loadingCep, setLoadingCep] = useState(false);
    const { codigo } = useParams();
    const [freteNome, setFreteNome] = useState('');
    const [fretePreco, setFretePreco] = useState(0);
    const [prazo, setPrazo] = useState(0);
    const [freteError, setFreteError] = useState('');
    const [product, setProduct] = useState({
        id: 54862,
        pro_descricao: '',
        pro_precovenda: "0.00",
        pro_url_amigavel: '',
        pro_modelo_com: '',
        pro_apresentacao: '',
        pro_referencia: '',
        pro_codigobarra: '',
        pro_prazogarantia: '',
        pro_conteudo_emb: '',
        name: '',
        model: '',
        price: '',
        reference: '',
        barcode: '',
        description: '',
        cores: [],
        images: [],
        packagingContent: '',
        categoryLevel1: {
            name:''
        },
        categoryLevel2: {
            name:''
        },
        brand: {
            id: 1,
            name: '',
        }
    });
    const [openedCart, setOpenedCart] = useState(false);

    useEffect(() => {

        const loadProdutos = async () => {
            const products = await getProdutosPage(8);
            setProdsRelation(products)
        };
      
        loadProdutos();
        
    }, []);

    const responsiveOptions = [
        { breakpoint: "1400px", numVisible: 4, numScroll: 2 },
        { breakpoint: "1199px", numVisible: 3, numScroll: 2 },
        { breakpoint: "991px", numVisible: 2, numScroll: 2 },
        { breakpoint: "767px", numVisible: 1, numScroll: 1 },
        { breakpoint: "575px", numVisible: 1, numScroll: 1 }  
    ];

    useEffect(() => {
        const header = document.getElementById("header-page");
        const headerPrice = document.getElementsByClassName("banner-product")[0];
        const sticky = header.offsetTop;

        const myFunction = (e) => {
            if (window.scrollY > 600) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        }
        window.addEventListener('scroll', myFunction);
        const fetchProduto = async () => {
            try {
                const response = await getProduto(codigo);
                if(response.status === 200 && response.data) {
                    setProduct(response.data[0]);
                    setSelectedImg(response.data[0].images[0].url)
                }
            } catch (error) {
                console.error('Erro ao buscar produtos', error);
            }
        };
        fetchProduto();

        const myFunctionTwo = (e) => {
            if (window.scrollY > 200) {
                headerPrice.classList.add("fixed");
            } else {
                headerPrice.classList.remove("fixed");
            }
        }
        window.addEventListener('scroll', myFunctionTwo);
    },[])

    const handleAddToCart = async () => {
        setLoadBtn(true);
        if(!addToCart(product, isActiveColorId)) {
            showToast('O produto já existe no carrinho!','error')
            setLoadBtn(false);
        }
        else {
            setTimeout(() => {
                setLoadBtn(false)
                showToast('O produto foi adicionado ao carrinho!','success')
                setOpenedCart(true);
            }, 500)
        }
    }

    const productTemplate = (product) => {
        const handleAddToCart = async () => {
            setLoadingProduct(product.id);
            if(!addToCart(product, null)) {
                showToast('O produto já existe no carrinho!', 'error');
                setLoadingProduct(null);
            } else {
                setTimeout(() => {
                    setLoadingProduct(null);
                    showToast('O produto foi adicionado ao carrinho!', 'success');
                    setOpenedCart(true);
                }, 500);
            }
        };

        return (
            <div className="product">
                <div className="wishlist-button">

                </div>
                <a href={`/produto/${product.pro_url_amigavel}`}>
                    <Image
                            src={product.img}
                            width={200}
                            height={200}
                            alt="Headphone"
                            layout="responsive"
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
                <a className='title-link-product' href={`/produto/${product.pro_url_amigavel}`}>
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
                        {product.name}
                    </Typography>
                </a>
                <div className="description">
                    {product.model}
                </div>
                <div className="price">
                    {product.preco}
                    <div className="discount">
                        (5% OFF)
                    </div>
                </div>
                <div className='addToCartBox d-flex justify-content-center'>
                    <button 
                        type='button' 
                        className='addToCartButton'
                        onClick={handleAddToCart}
                        disabled={loadingProduct === product.id}
                    >
                        {loadingProduct === product.id ? 'Adicionando...' : 'Adicionar ao carrinho'}
                    </button>
                </div>
            </div>
        )
    }

    function formatStr(str) {
        return str
            .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remove os caracteres de acentuação
            .replace(/[^a-zA-Z0-9 ]/g, ''); // Remove caracteres especiais, mantendo apenas letras, números e espaços
    }

    const changePicture = (id) => {
        setSelectedImg(product.images.find((imagem) => imagem.id === id).url)
    }

    const buscarEndereco = async (cep: string) => {
        if (cep.length === 9) {
            setLoadingCep(true);
            setFreteError('');
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setTimeout(async () => {
                    if (data.erro) {
                        setFreteError('CEP não encontrado!');
                        setLoadingCep(false);
                    } else {
                        try {
                            // Verificar se o ID do produto está disponível
                            const produtoId = product.id;
                            
                            if (!produtoId) {
                                setFreteError('Produto não identificado');
                                setLoadingCep(false);
                                return;
                            }
                            
                            // Usar apenas o produto atual para cálculo de frete
                            const dadosProdutos = [{
                                produto_id: produtoId,
                                quantity: 1
                            }];
                            
                            console.log('Calculando frete para produto:', produtoId, 'CEP:', cep);
                            const frete = await valorFreteDeslogado(cep, dadosProdutos);
                            console.log('Resposta API frete:', frete?.data);
                            
                            if (frete && frete.data && frete.data.data) {
                                setFreteNome('PAC');
                                setFretePreco(frete.data.data.totalPreco);
                                setPrazo(frete.data.data.maiorPrazo);
                                console.log('Frete calculado com sucesso:', frete.data.data);
                            } else {
                                console.error('Resposta inválida da API de frete:', frete);
                                setFreteError('Não foi possível calcular o frete para este produto.');
                            }
                        } catch (freteError) {
                            console.error('Erro ao calcular frete:', freteError);
                            setFreteError('Erro ao calcular o frete. Tente novamente.');
                        }
                    }
                    setLoadingCep(false);
                }, 800);
            } catch (error) {
                console.error('Erro ao buscar o endereço:', error);
                setFreteError('Erro ao buscar o endereço.');
                setLoadingCep(false);
            }
        }
    };

    const handleChangeCep = (e) => {
        const newCep = e.target.value;
        setCep(newCep);
    }
    
    const calcularFrete = () => {
        if (cep && cep.length === 9) {
            buscarEndereco(cep);
        } else {
            setFreteError('Digite um CEP válido');
        }
    }

    return (
    <>
        <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
        <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
        <ScrollTopButton/>
        <main>
            <section id="content-product">
                <div className="container">
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
                                {product.categoryLevel1.name}
                            </Typography>
                            <Typography
                                sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                            >
                                {product.categoryLevel2.name}
                            </Typography>
                            <Typography
                                sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                            >
                                {product.name}
                            </Typography>
                        </Breadcrumbs>
                    </div>
                </div>
                <div className="banner-product">
                    <div className="container d-flex">
                        <div className="col-lg-6 d-flex flex-column">
                            <h2>{product.pro_descricao}</h2>
                            <span className='sku'>{product.model}</span>
                            <div className="nav-product">
                                <div className="button-nav" onClick={() => scrollTo('caracteristicas')}><b>Características</b></div>
                                <div className="button-nav" onClick={() => scrollTo('especificacoes')}><b>Especificações Técnicas</b></div>
                                <div className="button-nav" onClick={() => scrollTo('tabs')}><b>Avaliações</b></div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex" style={{paddingLeft: '80px'}}>
                            <div className="price-info-head col-lg-6">
                                <span className='price'>
                                    {isPromoProd ? 
                                        <span>R$ {product.price.replace('.',',')}</span>
                                            :
                                        <>
                                            <span>De <b style={{textDecoration: 'line-through'}}>R$ {product.price.replace('.',',')}</b></span>
                                            <span>Por <b>R$ {(Number(product.price) - 5.00).toString().replace('.',',')}</b></span>
                                        </>
                                    }
                                </span>
                                <span>Em até 12x de <b>R$ {product.price.replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {(Number(product.price) - 5.00).toString().replace('.',',')}</span> no pagamento pix</span>
                            </div>
                            <div className="button-buy col-lg-6 d-flex align-items-center justify-content-center">
                                <button type='button'
                                    onClick={handleAddToCart}
                                    className='btn-buy-primary'
                                >
                                    {loadBtn ? 
                                        <CircularProgress color="inherit" />
                                        :
                                        'Comprar'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container d-flex flex-wrap">
                    <div className="content-img">
                        <div className="img-carrousel">
                            <Image
                                src={selectedImg}
                                alt="Headphone"
                                layout="responsive"
                                width={400}
                                height={400}
                            />
                        </div>
                        <div className="carrousel mt-4">
                            {product.images.map((p) => (
                                <div className="img-carrousel">
                                    <Image
                                        key={p.id}
                                        src={p.url}
                                        alt="Headphone"
                                        layout="responsive"
                                        width={150}
                                        height={150}

                                        onClick={() => changePicture(p.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="content-infoprod">
                        <div className="content-title-prod">
                            <h1>{product.pro_descricao}</h1>
                            <div className="rating-infoprod">
                                <div className="sku">SKU: {product.model}</div>
                                <div className="label-stars">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                    </svg>
                                    <p className="count-rating">(145)</p>
                                </div>
                            </div>
                            <hr/>
                            <div className="content-product-info">
                                <p>{product.description}</p>
                            </div>
                            {/* <div className='d-flex flex-direction-column align-items-center'>
                                <p className="text-colors">Cores:</p>
                                <div className="colors">
                                    {product.cores.map((item) => (
                                        <div 
                                            onClick={() => setIsActiveColorId(item.id)}
                                            className={'color ' + (isActiveColorId == item.id ? ' active' : '')}
                                            style={{backgroundColor: item.hex}}
                                        ></div>
                                    ))}
                                </div>
                            </div> */}
                            <hr />
                            <div className="content-price d-flex flex-direction-column align-items-center">
                                <h6>Calcule o Frete:</h6>
                                <div className="frete" style={{marginBottom: '15px'}}>
                                    <div className={'d-flex flex-column justify-content-center align-items-center'} style={{marginTop: '20px', marginBottom: '8px'}}>
                                    <ReactInputMask
                                        mask="99999-999"
                                        value={cep}
                                        onChange={handleChangeCep}
                                        maskChar=""
                                    >
                                        {(inputProps) => (
                                            <TextField
                                            {...inputProps}
                                            label="Digite o CEP"
                                            variant="standard"
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '23px', 
                                                    fontWeight: 'bold',
                                                },width: '120px',  marginBottom: '8px'
                                            }}
                                            />
                                        )}
                                    </ReactInputMask>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        size="small" 
                                        onClick={calcularFrete}
                                        disabled={loadingCep}
                                        style={{marginTop: '5px', fontSize: '12px', textTransform: 'none'}}
                                    >
                                        Calcular
                                    </Button>
                                    </div>
                                    {loadingCep && (
                                        <div className="text-center">
                                            <CircularProgress size={20} color="primary" />
                                            <span className="ml-2">Calculando frete...</span>
                                        </div>
                                    )}
                                    {freteError && (
                                        <div className="text-center text-danger">
                                            <small>{freteError}</small>
                                        </div>
                                    )}
                                    {freteNome && 
                                        <>
                                            <div className="frete-box">
                                                <div className="frete">
                                                    <div className='text-frete'>
                                                        <span>{freteNome} {'(até '+prazo+' dias úteis)'} </span>
                                                        <span className="price">R$ {fretePreco.toFixed(2).replace('.',',')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <span className="price text-center">
                                    R$ {Number(product.price).toFixed(2).replace('.',',')}
                                </span>
                                <span className="card-info">
                                    Até 12x no cartão
                                </span>
                                <span>Em até 12x de <b>R$ {Number(product.price).toFixed(2).replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {(Number(product.price) - 5).toString().replace('.',',')}</span> no pagamento pix</span>
                                <button type='button'
                                    onClick={handleAddToCart}
                                    className='btn-buy-primary mt-3'
                                >
                                    {loadBtn ? 
                                        <CircularProgress color="inherit" />
                                        :
                                        'Comprar'
                                    }
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
            <section id="recomend" style={{paddingBottom: '25px', marginTop: '25px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Recomendado para você</p>
                    </div>
                    <div className="products prod-listing" style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Carousel value={prodsRelation} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions} circular/>
                    </div>
                </div>
            </section>
            {/* <section id="banner_prod">
                <div className="container">
                    <Image
                        height={500}
                        src={BannerProd}
                        alt="Banner"
                        layout="responsive"
                    />
                </div>
            </section> */}
            <section id='especificacoes' style={{margin: '25px 0px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Especificações</p>
                    </div>
                    <div className="txt-espec-prods">
                        <p><strong>Referência:</strong> {product.reference}</p>
                        <p><strong>Descrição Técnica:</strong> {product.name}</p>
                        <p><strong>Modelo Comercial:</strong> {product.model}</p>
                        <p><strong>Marca:</strong> {product.brand.name}</p>
                        <p><strong>Apresentação:</strong> {product.description}</p>
                        {/* <p><strong>Tipo Giro:</strong> {product.pro_descricao}</p> */}
                        <p><strong>DUN14:</strong> {product.barcode}</p>
                        <p><strong>Prazo de Garantia:</strong> {product.pro_prazogarantia}</p>
                        <p><strong>Conteúdo Embalagem:</strong> {product.packagingContent}</p>
                    </div>
                </div>
            </section>
            <section id="tabs">
                <div className="container">
                    <div className="content-showtab">
                        <div className="tab-rating">
                            <div className="rating-left">
                                <h3>Avaliações</h3>
                                <div className="rating">
                                    <span className="rate">4.50</span>
                                    <div className="stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                        <p className="count-rating">(145)</p>
                                    </div>
                                </div>
                                <div className="rating-graph">
                                    <div className="line">
                                        <span>5</span>
                                        <div className="content-progress">
                                            <div style={{width: '80%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>4</span>
                                        <div className="content-progress">
                                            <div style={{width: '0%'}}className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>3</span>
                                        <div className="content-progress">
                                            <div style={{width: '10%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>2</span>
                                        <div className="content-progress">
                                            <div style={{width: '0%'}}className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>1</span>
                                        <div className="content-progress">
                                            <div style={{width: '10%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rating-right">
                                <h3>Mídia</h3>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="comments">
                            <div className="comment">
                                <div className="content-comment">
                                    <span>Fernanda Sales</span>
                                    <div className="label-stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                        </p>
                                    </div>
                                </div>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                            <div className="comment">
                                <div className="content-comment">
                                    <span>Alisson Campos</span>
                                    <div className="label-stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                        </p>
                                    </div>
                                </div>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </main>
    </>
  );
};

export default ProductPage;