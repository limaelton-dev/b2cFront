"use client"
import Image from 'next/image';
import './assets/css/home.css';
import LogoColetek from './assets/img/logo_coletek.png';
import Banner from './assets/img/banner.png';
import UserImg from './assets/img/user.jpg';
import HeadphoneImg from './assets/img/headphone.png';
import { search } from './services/search';
import { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_URL || '';
export default function HomePage() {

    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);

        if (value.length < 4) {
            setResults([]);
        }
    };

    useEffect(() => {
        if (searchTerm.length < 4) return;

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            submitSearch();
        }, 500);

        setDebounceTimeout(timeout);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchTerm]);

    const submitSearch = async () => {
        const response = await search(searchTerm);
        if (response.status == 200) {
            setResults(response.data);
        }
    };

    return (
        <>
            <header>
                <div className="bar-top">
                    <div className="container">
                        <ul>
                            <li>Contate-nos</li>
                            <li>Localize o pacote</li>
                            <li>Meus pedidos</li>
                        </ul>
                        <ul>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                    <path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm200-100q17 0 28.5-11.5T520-180q0-17-11.5-28.5T480-220q-17 0-28.5 11.5T440-180q0 17 11.5 28.5T480-140ZM280-320h400v-400H280v400Z"/>
                                </svg>
                                Baixar App
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                    <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/>
                                </svg>
                                Local da Loja
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                    <path d="M480-40 360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40Zm-4-240q21 0 35.5-14.5T526-330q0-21-14.5-35.5T476-380q-21 0-35.5 14.5T426-330q0 21 14.5 35.5T476-280Zm-36-154h74q0-17 1.5-29t6.5-23q5-11 12.5-20.5T556-530q35-35 49.5-58.5T620-642q0-53-36-85.5T487-760q-55 0-93.5 27T340-658l66 26q7-27 28-43.5t49-16.5q27 0 45 14.5t18 38.5q0 17-11 36t-37 42q-17 14-27.5 27.5T453-505q-7 15-10 31.5t-3 39.5Z"/>
                                </svg>
                                Central de Atendimento
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="content-header">
                    <div className="container">
                        <div className="row" style={{alignItems: 'center', marginBottom: '5px'}}>
                            <div className="logo">
                                <div className="logo-footer">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </div>
                            <div className="search">
                                <div className="content-search">
                                    <form action="">
                                        <select name="categorias" id="categorias-search">
                                            <option value="1" defaultValue={1}>Todas categorias</option>
                                            <option value="2">Categoria 1</option>
                                        </select>
                                        <input type="text" id="search" onChange={changeSearch}/>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                                            </svg>
                                        </button>
                                    </form>
                                    {results.length > 0  && 
                                        <div className="result-search">
                                            <ul>
                                                {results.map((result) => (
                                                    <li key={result.pro_codigo}><a target="_blank" href={URL+'/produto/'+result.pro_codigo}>{result.pro_descricao}</a></li>
                                                ))}
                                                {results.length > 5 && 
                                                   <li><a href="">Veja mais resultados</a></li> 
                                                }
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="user-preference">
                                <div className="cart content-preference">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#bcbcbc">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
                                    </svg>
                                    <div className="items-total">
                                        2
                                    </div>
                                    Carrinho
                                </div>
                                <div className="wishlist content-preference">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#bcbcbc">
                                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                                    </svg>
                                    <div className="items-total">
                                        3
                                    </div>
                                    Lista de desejos
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="categories">
                                <ul>
                                    <li>Celulares/Tablets</li>
                                    <li>Headsets/fones</li>
                                    <li>Notebooks/computadores</li>
                                    <li>Televisão/Rádios</li>
                                    <li>Todos os acessórios</li>
                                    <li>Outra página</li>
                                </ul>
                            </div>
                            <div className="user">
                                <div className="content-img">
                                    <Image
                                        src={UserImg}
                                        alt="Icone Usuário"
                                        height={45}
                                        width={45}
                                    />
                                </div>
                                <div className="content-text">
                                    <p className="nome">Márcio Mendes</p>
                                    <p className="email">marciomendes.gmail.com</p>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <section id="banner">
                    <Image
                        src={Banner}
                        alt="Banner"
                    />
                </section>
                <section id="info-cards">
                    <div className="container d-flex">
                        <div className="col-lg-3 card-info">
                            <div className="content">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm480 0q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120Z"/>
                                </svg>
                                <div className="content-text">
                                    <p>Frete grátis</p>
                                    <p className="description-text">
                                        Veja as condições
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 card-info">
                            <div className="content">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z"/>
                                </svg>
                                <div className="content-text">
                                    <p>Compra segura</p>
                                    <p className="description-text">
                                        Sua compra é segura
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 card-info">
                            <div className="content">
                                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z" stroke="#292D32"/>
                                    <path d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z" stroke="#292D32"/>
                                    <path d="M5.25 17.8101H6.96997" stroke="#fff"/>
                                    <path d="M9.10986 17.8101H12.5499" stroke="#fff"/>
                                    <path d="M2 12.6101H19" stroke="#fff"/>
                                </svg>
                                <div className="content-text">
                                    <p>Parcele em até 12x</p>
                                    <p className="description-text">
                                        Sem juros no crédito
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 card-info">
                            <svg fill="#000000" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"/>
                                <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"/>
                            </svg>
                            <div className="content-text">
                                <p>Pagamento com Pix liberado</p>
                                <p className="description-text">
                                    Aprovação instantânea
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="promo">
                    <div className="container">
                        <div className="cards">
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="prod-newest">
                    <div className="container">
                        <div className="title-section">
                            <p>Lançamentos</p>
                        </div>
                        <div className="products prod-listing">
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="marcas">
                    <div className="container">
                        <div className="title-section">
                            <p>Veja as marcas</p>
                        </div>
                        <div className="content-marcas">
                            <a href="" className="link-marca">
                                <div className="marca col-lg-2">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </a>
                            <a href="" className="link-marca">
                                <div className="marca col-lg-2">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </a>
                            <a href="" className="link-marca">
                                <div className="marca col-lg-2">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </a>
                            <a href="" className="link-marca">
                                <div className="marca col-lg-2">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </a>
                            <a href="" className="link-marca">
                                <div className="marca col-lg-2">
                                    <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                                </div>
                            </a>
                        </div>
                    </div>
                </section>
                <section id="prod-trending">
                    <div className="container">
                        <div className="title-section">
                            <p>Mais vendidos</p>
                        </div>
                        <div className="products prod-listing">
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                        src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                            <div className="product">
                                <div className="wishlist-button">

                                </div>
                                <Image
                                    src={HeadphoneImg}
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
                                <div className="title-product">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="description">
                                    Headphone Coletek 7.1 surround
                                </div>
                                <div className="price">
                                    R$ 235,50
                                    <div className="discount">
                                        (5% OFF)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="colecao-categorias">
                    <div className="container">
                        <div className="title-section">
                            Coleção de produtos por categoria
                        </div>
                        <div className="content-collections">
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo">
            
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo ">
                                
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo">
            
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="prod-categorias">
                    <div className="container">
                        <div className="title-section">
                            <p>Smart Life Produtos</p>
                            <ul>
                                <li>Celulares/Tablets</li>
                                <li>Headsets/fones</li>
                                <li>Notebooks/computadores</li>
                                <li>Televisão/Rádios</li>
                                <li>Todos os acessórios</li>
                                <li className="link-all">Ver tudo</li>
                            </ul>
                        </div>
                        <div className="content">
                            <div className="promo-banner">
                                <div className="banner"></div>
                            </div>
                            <div className="products">
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                                <div className="product">
                                    <div className="wishlist-button">

                                    </div>
                                    <Image
                                        src={HeadphoneImg}
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
                                    <div className="title-product">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="description">
                                        Headphone Coletek 7.1 surround
                                    </div>
                                    <div className="price">
                                        R$ 235,50
                                        <div className="discount">
                                            (5% OFF)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="banner-promo">
                    <div className="container">
                        <div className="banner-promo-full">
                                    
                        </div>
                    </div>
                </section>
                <footer>
                    <div className="container d-flex flex-wrap">
                        <div className="col-lg-3">
                            <div className="logo-footer">
                                <Image
                                        src={LogoColetek}
                                        alt="Logo Coletek"
                                    />
                            </div>
                            <h4>Siga-nos nas<br/>redes sociais!</h4>
                            <ul>
                                <li></li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Institucional</h4>
                            <ul>
                                <li>
                                    <a href="">Quem somos</a>
                                </li>
                                <li>
                                    <a href="">Blog</a>
                                </li>
                                <li>
                                    <a href="">Localização</a>
                                </li>
                                <li>
                                    <a href="">Trabalhe conosco</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Dúvidas</h4>
                            <ul>
                                <li>
                                    <a href="">Política de privacidade</a>
                                </li>
                                <li>
                                    <a href="">Política de entrega</a>
                                </li>
                                <li>
                                    <a href="">Termos e condições</a>
                                </li>
                                <li>
                                    <a href="">Central de atendimento</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Newsletter</h4>
                            <p>Inscreva-se para receber nossas ofertas!</p>
                            <form action="url" method="POST" id="newsletter-form">
                                <div className="content-inp">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/>
                                    </svg>
                                    <input type="text" name="email" placeholder="Digite seu email"/>
                                </div>
                                <button>
                                    Inscrevra-se
                                </button>
                            </form>
                        </div>
                        <div className="copyright">
                            <hr/>
                            <p>©️ Coletek 2024.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
