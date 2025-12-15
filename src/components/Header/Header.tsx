'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import TopBar from './TopBar';
import Logo from './Logo';
import SearchBox from './SearchBox/SearchBox';
import UserMenu from './UserMenu/UserMenu';
import CartButton from './CartButton/CartButton';
import CategoriesNav from './CategoriesNav/CategoriesNav';
import { useCart } from '../../context/CartProvider';
import { useAuth } from '../../context/AuthProvider';

type Props = {
  cartOpened: boolean;
  onCartToggle: (open: boolean) => void;
};

export default function Header({ cartOpened, onCartToggle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();
  const { user } = useAuth();

  const handleSubmitSearch = (term: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('s', term);
    if (pathname === '/produtos') {
      router.replace(`?${params.toString()}`); // sem reload
    } else {
      router.push(`/produtos?${params.toString()}`);
    }
  };

  return (
    <header id="header-page">
      <TopBar />
      <div className="content-header">
        <div className="row">
          <Logo onClick={() => router.push('/')} />
          <SearchBox onSubmit={handleSubmitSearch} />
          <Box
            className="user-preference"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserMenu user={user} />
            <CartButton
              count={cart?.items?.length || 0}
              onClick={() => onCartToggle(!cartOpened)}
            />
          </Box>
        </div>
        <div className="row">
          <CategoriesNav />
        </div>
      </div>
    </header>
  );
}
