import Image from 'next/image';
import LogoColetek from './assets/img/logo_coletek.png';
import Headphone from './assets/img/headphone.png';
import Banner1 from './assets/img/132.jpg';
import UserImg from './assets/img/user.jpg';
import NoImage from './assets/img/noimage.png';
import { useEffect, useState } from 'react';
import { search } from './services/search';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import { useCart } from './context/cart';
import { useAuth } from './context/auth';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContextType, User } from './interfaces/interfaces';
import { Link, Typography, Button, Menu, MenuItem, ListItemIcon, Divider, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { logout } from './services/auth';
import { getProdutosFabricante } from './services/produto/page';



interface ProductResponse {
  brand: any;
  categories: any[];
}


const URL = process.env.NEXT_PUBLIC_URL || '';
export default function Header({ cartOpened, onCartToggle }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems } = useCart();
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [fabricantes, setFabricantes] = useState<ProductResponse[]>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    
    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);

        if (value.length < 4) {
            setResults([]);
        }
    };

    useEffect(() => {
        async function getFabricantes() {
            const resp = await getProdutosFabricante();
            console.log(resp.data, 'Oiee')
            const prodFormatted = resp.data.map((b: any) => ({
                brand: b.brand,
                categories: b.categories
            }));
            setFabricantes(prodFormatted);
        }
        getFabricantes();
    }, [])

    const handleKeyDown =  async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(pathname == '/product') {
                const params = new URLSearchParams();
                await params.set('s', searchTerm);
                await router.push(`?${params.toString()}`);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                router.push(`/product?s=${searchTerm}`)
            }
        }
    };

    const clickSearch = async () => {
        if(pathname == '/product') {
            const params = new URLSearchParams();
            await params.set('s', searchTerm);
            await router.push(`?${params.toString()}`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        else {
            router.push(`/product?s=${searchTerm}`)
        }
    }

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
            // Os resultados já estão processados pelo serviço de busca
            setResults(response.data);
        }
    };

    const changeOpenedCart = () => {
        onCartToggle(!cartOpened)
    }

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Novas funções para controlar o hover
    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMouseLeave = () => {
        setTimeout(() => {
            setAnchorEl(null);
        }, 150);
    };

    return (
        <header id="header-page">
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
                            <div className="logo-footer" >
                                <Image
                                    onClick={() => router.push('/')} 
                                    style={{cursor: 'pointer'}}
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
                                    <input type="text" id="search" onKeyDown={handleKeyDown} onChange={changeSearch}/>
                                    <button type='button' onClick={clickSearch}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                                        </svg>
                                    </button>
                                </form>
                                {results.length > 0  && 
                                    <div className="result-search">
                                        <ul>
                                            {results.map((result) => {
                                                const imageUrl = result.img || (result.imagens && result.imagens.length > 0 ? result.imagens[0].url : NoImage);
                                                
                                                return (
                                                    <li key={result.pro_codigo} style={{display: 'flex', alignItems: 'center'}}>
                                                        <div style={{width: '50px', height: '50px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Image
                                                                src={imageUrl || NoImage}
                                                                alt={result.pro_desc_tecnica}
                                                                width={50}
                                                                height={50}
                                                                style={{objectFit: 'contain'}}
                                                            />
                                                        </div>
                                                        <a target="_blank" className='search-product-link' style={{textDecoration: 'none', color: 'black', display: 'flex',flexGrow: '1', justifyContent: 'space-between', height: '50px', alignItems: 'center'}} href={URL+'/produto/'+result.id}>{result.pro_desc_tecnica}<LaunchIcon sx={{width: '18px'}} /></a>
                                                    </li>
                                                );
                                            })}
                                            {results.length > 5 && 
                                                <li><a href="">Veja mais resultados</a></li> 
                                            }
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="user-preference">
                            <div className="user">
                                <div className="content-img" onClick={() => user.name ? router.push('/minhaconta') : router.push('/login')} style={{cursor: 'pointer'}}>
                                    {user.name ? 
                                        <Image
                                            src={UserImg}
                                            alt="Icone Usuário"
                                            height={45}
                                            width={45}
                                        />
                                        :
                                        <PersonOutlineOutlinedIcon/>
                                    }
                                </div>
                                <div className="content-text">
                                    {user.name ? <p className='nome' onClick={() => router.push('/minhaconta')} style={{cursor: 'pointer'}}>{user.name}</p> :  <div className='entre-cad'><a href="/login">Entre</a> ou<br/><a href="/register">Cadastre-se</a></div>}
                                    <p className="email">{user.email || ''}</p>
                                    <div className="d-flex">
                                        {user.name ? <button className='acc-button' onClick={() => {router.push('/minhaconta');}}>Minha Conta</button> : <></>}
                                        {user.name ? <button className='logout-button' onClick={() => {logout();router.push('/login');}}>Sair</button> : <></>}
                                    </div>
                                </div>
                            </div>  
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
                        </div>
                    </div>
                    <div className="row d-flex">
                        <div className="categories d-flex justify-content-between">
                            <div>
                                <Button
                                    aria-controls={open ? 'departamentos-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleMenuClick}
                                    onMouseEnter={handleMouseEnter}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    disableRipple
                                    sx={{ 
                                        color: '#1976d2', 
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        borderRadius: '4px 4px 0 0',
                                        backgroundColor: open ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                        },
                                        zIndex: open ? 1301 : 'auto'
                                    }}
                                >
                                    Departamentos
                                </Button>
                                <Menu
                                    id="departamentos-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'departamentos-button',
                                        onMouseLeave: handleMouseLeave,
                                        onMouseEnter: () => clearTimeout(debounceTimeout)
                                    }}
                                    sx={{
                                        overflow: 'initial'
                                    }}
                                    PaperProps={{
                                        elevation: 3,
                                        onMouseLeave: handleMouseLeave,
                                        sx: { 
                                            width: 220,
                                            maxHeight: 400,
                                            overflow: 'auto',
                                            borderRadius: '0 0 8px 8px',
                                            mt: 0,
                                            border: '1px solid rgba(25, 118, 210, 0.2)',
                                            borderTop: 'none'
                                        }
                                    }}
                                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                    disableAutoFocus
                                    disableEnforceFocus
                                    slotProps={{
                                        paper: {
                                            onMouseEnter: () => clearTimeout(debounceTimeout),
                                            onMouseLeave: handleMouseLeave
                                        }
                                    }}
                                >
                                    {fabricantes && fabricantes.map((f) => (
                                        <MenuItem 
                                            key={f.brand.id}
                                            className='relative-item'
                                            onClick={() => {
                                                handleMenuClose();
                                                router.push(`/produtos?limit=12&fabricante=${f.brand.id}&page=1`);
                                            }}
                                            sx={{
                                                py: 1,
                                                px: 2,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                    color: '#1976d2'
                                                }
                                            }}
                                        >
                                            <Typography variant="body2">{f.brand.name}</Typography>
                                            <div className="submenu-itens">
                                                {f.categories && f.categories.map((j) => (
                                                    
                                                    <MenuItem 
                                                        key={j.id} 
                                                        className='submenu-items'
                                                        onClick={() => {
                                                            handleMenuClose();
                                                            router.push(`/produtos?limit=12&fabricante=${j.id}&page=1`);
                                                        }}
                                                        sx={{
                                                            py: 1,
                                                            px: 2,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                color: '#1976d2'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="body2">{j.name}</Typography>
                                                    </MenuItem>
                                                ))}   
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                            <ul>
                                <li>
                                    <Link underline="hover" color="inherit" href="/produtos?categoria=1&page=1">
                                        Gabinete
                                    </Link>
                                </li>
                                <li>
                                    <Link underline="hover" color="inherit" href="/produtos?categoria=2&page=1">
                                        Mouse
                                    </Link>
                                </li>
                                <li>
                                    <Link underline="hover" color="inherit" href="/produtos?categoria=7&page=1">
                                        Teclado
                                    </Link>
                                </li>
                                <li>
                                    <Link underline="hover" color="inherit" href="/produtos?categoria=6&page=1">
                                        Acessórios
                                    </Link>
                                </li>
                                <li>
                                    <Link underline="hover" color="inherit" href="/produtos?categoria=5&page=1">
                                        Fonte de Alimentação
                                    </Link>
                                </li>
                                <li>
                                    <Link className='btn-buy-primary ofertas-link' underline="hover" color="inherit" href="/produtos">
                                        Todos os produtos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div>
        </header>
    );
}