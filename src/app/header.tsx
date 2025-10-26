
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCart } from './context/CartProvider';
import { useAuth } from './context/AuthProvider';
import TopBar from './components/Header/TopBar';
import Logo from './components/Header/Logo';
import SearchBox from './components/Header/SearchBox/SearchBox';
import UserMenu from './components/Header/UserMenu/UserMenu';
import CartButton from './components/Header/CartButton/CartButton';
import CategoriesNav from './components/Header/CategoriesNav/CategoriesNav';

type HeaderProps = {
    cartOpened: boolean;
    onCartToggle: (opened: boolean) => void;
};

export default function Header({ cartOpened, onCartToggle }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems } = useCart();

    const handleSubmitSearch = (term: string) => {
        if (pathname === '/produtos') {
            const params = new URLSearchParams(window.location.search);
            params.set('s', term);
            router.push(`?${params.toString()}`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            router.push(`/produtos?s=${term}`);
        }
    };

    const handleCartToggle = () => {
        onCartToggle(!cartOpened);
    };

    return (
        <header id="header-page">
            <TopBar />
            <div className="content-header">
                <div className="container">
                    <div className="row" style={{alignItems: 'center', marginBottom: '5px'}}>
                        <div className="logo">
                            <div className="logo-footer">
                                <Logo onClick={() => router.push('/')} />
                            </div>
                        </div>
                        <SearchBox onSubmit={handleSubmitSearch} />
                        <div className="user-preference">
                            <UserMenu user={user} />
                            <CartButton 
                                count={cartItems?.length || 0} 
                                onClick={handleCartToggle} 
                            />
                        </div>
                    </div>
                    <div className="row d-flex">
                        <CategoriesNav />
                    </div>
                </div>
            </div>
        </header>
    );
}