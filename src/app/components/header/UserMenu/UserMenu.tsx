'use client';

import Image from 'next/image';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserImg from '../../../assets/img/user.jpg';
import { useRouter } from 'next/navigation';

type User = { name?: string; email?: string };
export default function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  const goAccount = () => router.push('/minhaconta');
  const goLogin = () => router.push('/login');
  const logout = async () => { 
    const { logout: logoutService } = await import('../../../services/auth');
    logoutService();
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
              <button className="logout-button" onClick={logout}>Sair</button>
            </div>
          </>
        ) : (
          <div className="entre-cad">
            <a href="/login">Entre</a> ou<br /><a href="/register">Cadastre-se</a>
          </div>
        )}
      </div>
    </div>
  );
}
