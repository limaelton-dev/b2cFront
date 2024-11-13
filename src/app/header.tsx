import Image from 'next/image';
import LogoColetek from './assets/img/logo_coletek.png';
import UserImg from './assets/img/user.jpg';
import { useEffect, useState } from 'react';
import { search } from './services/search';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { useCart } from './context/cart';
import { useAuth } from './context/auth';

const URL = process.env.NEXT_PUBLIC_URL || '';
export default function Header({ cartOpened, onCartToggle }) {
    const { user } = useAuth();
    const { cartItems } = useCart();
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

    const changeOpenedCart = () => {
        onCartToggle(!cartOpened)
    }

    return (
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
                            <div className="cart content-preference" onClick={changeOpenedCart}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#bcbcbc">
                                    <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/>
                                </svg>
                                {cartItems && cartItems.length > 0 &&
                                    <div className="items-total">
                                        {cartItems.length}
                                    </div>
                                }
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
                                <p className="nome">{user ? user.name : ''}</p>
                                <p className="email">{user ? user.email : ''}</p>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </header>
    );
}