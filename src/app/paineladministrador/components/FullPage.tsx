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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek_white.png';
import UserImage from '../../assets/img/user.jpg';
import DadosPessoaisForm from './forms/DadosPessoaisForm';

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

export default function FullPage() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState('Dados Pessoais');
  const [fadeIn, setFadeIn] = React.useState(true);
  const [renderedSection, setRenderedSection] = React.useState('Dados Pessoais');

  const drawerIcons = [
    <BadgeIcon />,
    <ShoppingBagIcon />,
    <PlaceIcon />,
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (section: string) => {
    setSelectedSection(section); // Atualiza o titulo de guia dentro da página
    setFadeIn(false); // Iniciar a transição de saída
    setTimeout(() => {
      setRenderedSection(section); // Atualiza o conteúdo após a transição de saída
      setFadeIn(true); // Iniciar a transição de entrada
    }, 300); // Tempo da transição de saída
  };

  // const renderContent = () => {
  //   switch (renderedSection) {
  //     case 'Dados Pessoais':
  //       return <DadosPessoaisForm />;
  //     case 'Produtos'
  //        return <Produtos />;
  //     default:
  //       return (
  //         <Typography sx={{ marginBottom: 2 }}>
  //           Selecione uma opção no menu.
  //         </Typography>
  //       );
  //   }
  // };

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
          {/**esse box eu quero deixar no final a direita */}
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
            <Avatar alt="Joao" src={UserImage.src} sx={{ width: 40, height: 40, marginRight: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' , justifyContent: 'center'}}>
              <Typography variant="caption" noWrap>
                João Silva
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
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
          {['Dados Pessoais', 'Produtos'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleListItemClick(text)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? 'initial' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#691111'
                  }}
                >
                  {drawerIcons[index]}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography variant="caption">
          <span style={{ color: '#691111' }}>Minha conta</span>
          <span style={{ color: '#0C114E' }}><ArrowRightIcon /></span>
          <span style={{ color: '#0C114E' }}>{selectedSection}</span>
        </Typography>

        {selectedSection && (
          <Fade in={fadeIn} timeout={500}>
            <Box 
              sx={{padding:'20px 200px'}}
            > 
              {/* {renderContent()} */}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
