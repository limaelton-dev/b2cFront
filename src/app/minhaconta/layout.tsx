import '@/assets/css/--globalClasses.css';
import '@/assets/css/home.css';
import '@/assets/css/home/header.css';
import '@/assets/css/home/cart.css';
import '@/assets/css/home/footer.css';
import '@/assets/css/home/categorias.css';

interface MinhaContaLayoutProps {
  children: React.ReactNode;
}

export default function MinhaContaLayout({ children }: MinhaContaLayoutProps) {
  return <>{children}</>;
} 