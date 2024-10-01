import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import headphoneImage from '../../assets/img/headphone.png';

import Image from 'next/image';

const MinhasComprasPage = () => {
  const compras = [
    {
      id: 1,
      produto: 'Produto 1',
      valor: 'R$ 3500,00',
      quantidade: 3,
      imagem: headphoneImage,
      status: 'A caminho'
    },
    {
      id: 2,
      produto: 'Produto 2',
      valor: 'R$ 1500,00',
      quantidade: 2,
      imagem: headphoneImage,
      status: 'A caminho'
    },
    {
      id: 3,
      produto: 'Produto 3',
      valor: 'R$ 1500,00',
      quantidade: 1,
      imagem: headphoneImage,
      status: 'Entregue'
    },
    {
      id: 4,
      produto: 'Produto 4',
      valor: 'R$ 1500,00',
      quantidade: 3,
      imagem: headphoneImage,
      status: 'Cancelada'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue':
        return 'green';
      case 'A caminho':
        return 'blue';
      case 'Cancelada':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} margin={3}>
      {compras.map((compra) => (
        <Card key={compra.id} sx={{ display: 'flex', flexDirection: 'row', width: 'calc(50% - 16px)', alignItems: 'center'}}>
          <Box component="div" sx={{width: '250px', height: '200px', display: 'flex', alignItems: 'center'}}>
            <Image
              src={compra.imagem}
              alt={compra.produto}
              layout='responsive'
            />
          </Box>          
          <Container>
            <Box>
              <Typography
                gutterBottom
                variant="subtitle1"
                component="div"
                sx={{ 
                  color: getStatusColor(compra.status),
                  fontWeight: '600',
                  paddingLeft: '14px'
                }}
              >
                {compra.status}
              </Typography>
              <Typography gutterBottom variant="subtitle2" component="div">
                <IconButton>
                  <PlaceIcon sx={{ color: '#8a0303' }} /> {/* Ícone PlaceIcon com cor vermelha */}
                </IconButton>
                Rua João Amaral, 150 - São Paulo/SP
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h6" component="div">
                  {compra.produto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor: {compra.valor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantidade: {compra.quantidade}
                </Typography>
              </CardContent>
            </Box>
          </Container>
        </Card>
      ))}
    </Box>
  );
};

export default MinhasComprasPage;
