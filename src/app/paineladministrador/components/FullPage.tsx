"use client";
import { useRouter, usePathname } from 'next/navigation';
import * as React from 'react';
//não esquecer de criar "Cartões*"
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BadgeIcon from '@mui/icons-material/Badge';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PlaceIcon from '@mui/icons-material/Place';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import Fade from '@mui/material/Fade';
import VerifiedIcon from '@mui/icons-material/Verified';

import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek_white.png';
import UserImage from '../../assets/img/user.jpg';
import DadosPessoaisForm from './forms/DadosPessoaisForm';
import ProductsPage from './ProductsPage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Store,
  Payment,
  LocalShipping,
  Notifications,
  Security,
  Email,
  Receipt,
  Api,
  Language,
  Group,
  ShoppingCart as ShoppingCartMenuIcon
} from '@mui/icons-material';

const drawerWidth = 240;


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

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
  }
];

const configItems = [
  {
    title: 'Configurações',
    path: '/paineladministrador/configuracoes',
    icon: <SettingsIcon />
  }
];

export default function FullPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getCurrentPageTitle = () => {
    const allItems = [...menuItems, ...configItems];
    const currentItem = allItems.find(item => item.path === pathname);
    return currentItem?.title || 'Painel';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ background: 'linear-gradient(90deg, rgba(106,17,17,1) 0%, rgba(14,17,43,1) 64%, rgba(12,17,79,1) 100%)' }}>
        <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[{ marginRight: 5 }, open && { display: 'none' }]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ padding: '5px' }}>
              <div className="logo">
                <Image
                  src={LogoColetek}
                  alt="Logo Coletek"
                  width={90}
                  height={55}
                />
              </div>
            </Typography>
          <Box component="div">
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>
            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}

            <IconButton
              size="large"
              aria-label="Mostrar 5 novas notificações"
              color="inherit"
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="Abrir carrinho"
              color="inherit"
            >
              <Badge badgeContent={5} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>

            
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>

        <DrawerHeader
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: theme.spacing(0, 2),
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <Avatar 
              alt="Joao" 
              src={UserImage.src} 
              sx={{ 
                width: 28, 
                height: 28, 
                marginRight: 1,
                border: '2px solid #691111'
              }} 
            />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden', 
              justifyContent: 'center' 
            }}>
              <Typography 
                variant="caption" 
                noWrap 
                sx={{ fontSize: '0.7rem', fontWeight: 500 }}
              >
                João Silva
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                noWrap 
                sx={{ fontSize: '0.65rem' }}
              >
                joaosilva24@email.com
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider/>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 42,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                }}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    '& .MuiTypography-root': {
                      fontSize: '0.85rem'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {configItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 42,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                }}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    '& .MuiTypography-root': {
                      fontSize: '0.85rem'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#691111', fontSize: '0.75rem' }}>Painel Admin</span>
          <ArrowRightIcon sx={{ fontSize: '0.9rem', color: '#0C114E' }} />
          <span style={{ color: '#0C114E', fontSize: '0.75rem' }}>{getCurrentPageTitle()}</span>
        </Typography>

        <Box 
          sx={{
            padding: { 
              xs: '12px', 
              sm: '16px 60px', 
              md: '20px 100px' 
            },
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        > 
          {children}
        </Box>
      </Box>
    </Box>
  );
}
