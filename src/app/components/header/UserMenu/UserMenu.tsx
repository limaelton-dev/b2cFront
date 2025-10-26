'use client';

import Image from 'next/image';
import Link from 'next/link';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserImg from '../../../assets/img/user.jpg';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthProvider';

type User = { name?: string; email?: string };

export default function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const { logout } = useAuth(); // centraliza a lógica

  const goAccount = () => router.push('/minhaconta');
  const goLogin = () => router.push('/login');

  const onLogout = async () => {
    try {
      await logout();          // limpa token + estado global
      router.push('/');        // navega (ou /login, sua escolha)
    } catch (e) {
      console.error('Falha ao sair:', e);
      // opcional: toast
    }
  };

  return (
    <div className="user">
      <div className="content-img" onClick={() => (user?.name ? goAccount() : goLogin())} style={{ cursor: 'pointer' }}>
        {user?.name ? (
          <Image src={UserImg} alt="Usuário" width={45} height={45} />
        ) : (
          <PersonOutlineOutlinedIcon />
        )}
      </div>

      <div className="content-text">
        {user?.name ? (
          <>
            <p className="nome" onClick={goAccount} style={{ cursor: 'pointer' }}>{user.name}</p>
            <p className="email">{user.email || ''}</p>
            <div className="d-flex">
              <button className="acc-button" onClick={goAccount}>Minha Conta</button>
              <button className="logout-button" onClick={onLogout}>Sair</button>
            </div>
          </>
        ) : (
          <div className="entre-cad">
            <Link href="/login">Entre</Link> ou<br />
            <Link href="/register">Cadastre-se</Link>
          </div>
        )}
      </div>
    </div>
  );
}
