'use client';

import { useRouter, usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Logo from '../header/Logo';
import SearchBox from '../header/SearchBox/SearchBox';
import UserMenu from '../header/UserMenu/UserMenu';
import CartButton from '../header/CartButton/CartButton';
import CategoriesNav from '../header/CategoriesNav/CategoriesNav';
import styles from './header.module.css';
import { useCart } from '../../context/cart';
import { useAuth } from '../../context/auth';

type Props = {
  cartOpened: boolean;
  onCartToggle: (open: boolean) => void;
};

export default function Header({ cartOpened, onCartToggle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart();
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
    <header className={styles.header} id="header-page">
      <TopBar />
      <div className={styles.container}>
        <div className={styles.row}>
          <Logo onClick={() => router.push('/')} />
          <SearchBox onSubmit={handleSubmitSearch} />
          <div className={styles.userArea}>
            <UserMenu user={user} />
            <CartButton
              count={cartItems?.length ?? 0}
              onClick={() => onCartToggle(!cartOpened)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <CategoriesNav />
        </div>
      </div>
    </header>
  );
}
