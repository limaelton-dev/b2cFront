import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

interface DrawerProps {
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
}

export default function TemporaryDrawer({ open, toggleDrawer }: DrawerProps) {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      {/* Fechar o Drawer ao clicar em um item */}
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => toggleDrawer(false)}> {/* Agora fecha ao clicar no item */}
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleDrawer(false)} // Fecha o Drawer manualmente ao clicar no botão
      sx={{
        '& .MuiDrawer-paper': {
          top: '70px',
        },
      }}
      BackdropProps={{
        invisible: true, // Remove o backdrop, mas ainda permite fechar ao clicar fora
      }}
      disableEscapeKeyDown // Desativa o fechamento com a tecla "Escape"
    >
      {DrawerList}
    </Drawer>
  );
}
