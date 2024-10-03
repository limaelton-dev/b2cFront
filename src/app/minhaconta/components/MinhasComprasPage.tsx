import React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlaceIcon from '@mui/icons-material/Place';
import Image from 'next/image';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import headphoneImage from '../../assets/img/headphone.png';

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
    <Box display="flex" flexDirection="column" gap={2} margin={3}>
      {compras.map((compra) => (
        <Accordion key={compra.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${compra.id}-content`}
            id={`panel${compra.id}-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Imagem do produto */}
              <Box sx={{ width: '60px', height: '60px', marginRight: 2 }}>
                <Image
                  src={compra.imagem}
                  alt={compra.produto}
                  width={60}
                  height={60}
                />
              </Box>
              {/* Nome do produto */}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {compra.produto}
              </Typography>
              {/* Status do produto */}
              <Typography
                sx={{ color: getStatusColor(compra.status), fontWeight: '600' }}
              >
                {compra.status}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Box sx={{ width: '250px', height: '200px', display: 'flex', alignItems: 'center' }}>
                <Image
                  src={compra.imagem}
                  alt={compra.produto}
                  layout="responsive"
                />
              </Box>
              <Box sx={{ flex: 1, paddingLeft: 2 }}>
                <Typography gutterBottom variant="subtitle2" component="div">
                  <IconButton>
                    <PlaceIcon sx={{ color: '#8a0303' }} />
                  </IconButton>
                  Rua João Amaral, 150 - São Paulo/SP
                </Typography>
                <Divider />
                <CardContent>
                  <Typography variant="body1" component="div">
                    Valor: {compra.valor}
                  </Typography>
                  <Typography variant="body1" component="div">
                    Quantidade: {compra.quantidade}
                  </Typography>
                </CardContent>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MinhasComprasPage;
