import React from 'react';
import FullPage from './components/FullPage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/paineladministrador',
    icon: <DashboardIcon />
  },
  {
    title: 'Produtos',
    path: '/paineladministrador/produtos',
    icon: <Inventory2Icon />
  },
  {
    title: 'Pedidos',
    path: '/paineladministrador/pedidos',
    icon: <ShoppingCartIcon />
  },
  {
    title: 'Clientes',
    path: '/paineladministrador/clientes',
    icon: <PeopleIcon />
  },
  {
    title: 'Configurações',
    path: '/paineladministrador/configuracoes',
    icon: <SettingsIcon />,
    divider: true
  }
];

export default function PainelAdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FullPage>{children}</FullPage>;
} 