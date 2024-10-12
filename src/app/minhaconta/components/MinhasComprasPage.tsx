import React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PlaceIcon from '@mui/icons-material/Place';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import Image from 'next/image';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import headphoneImage from '../../assets/img/headphone.png';

const MinhasComprasPage = () => {
  const pedidos = [
    {
      id: 1,
      produtos: [
        { nome: 'Produto 1', valor: 'R$ 3500,00', quantidade: 3, imagem: headphoneImage },
        { nome: 'Produto 2', valor: 'R$ 1500,00', quantidade: 2, imagem: headphoneImage },
      ],
      status: 'A caminho',
    },
    {
      id: 2,
      produtos: [
        { nome: 'Produto 3', valor: 'R$ 1500,00', quantidade: 1, imagem: headphoneImage },
      ],
      status: 'Entregue',
    },
    {
      id: 3,
      produtos: [
        { nome: 'Produto 4', valor: 'R$ 1500,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Cancelada',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue':
        return '#5dc44b';
      case 'A caminho':
        return '#3a58cf';
      case 'Cancelada':
        return '#bf3737';
      default:
        return 'black';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Entregue':
        return <CheckCircleIcon sx={{ color: '#5dc44b', marginRight: 1, width: '18px'}} />;
      case 'A caminho':
        return <LocalShippingIcon sx={{ color: '#3a58cf', marginRight: 1, width: '18px'}} />;
      case 'Cancelada':
        return <CancelIcon sx={{ color: '#bf3737', marginRight: 1, width: '18px' }} />;
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} margin={3}>
      {pedidos.map((pedido) => (
        <Accordion key={pedido.id} sx={{ boxShadow: '0px 1px 7px 1px #BEBEBE', borderRadius: '8px', overflow: 'hidden' }}>
        {/* <Accordion key={pedido.id} sx={{ boxShadow: '3', borderRadius: '8px', overflow: 'hidden' }}> */}
          <AccordionSummary>
            <Box sx={{ width: '100%' }}>
              {/* Status do Pedido com Ícone */}
              <Box sx={{ display: 'flex', alignItems: 'center'}}>
                {getStatusIcon(pedido.status)}
                <Typography sx={{ color: getStatusColor(pedido.status), fontWeight: '400', fontSize: '15px'}}>
                  {pedido.status}
                </Typography>
              </Box>

              {/* Divider entre o status e o nome do pedido */}
              <Divider sx={{ marginY: 1, background: '#AEAEAE', height: '2px'}} />

              {/* Nome do Pedido e o botão "Ver mais" */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 0px'}}>

                <Typography variant="h6" color="#5a5a5a" fontWeight='400'>Pedido {pedido.id}</Typography>

                {/* Espaço flexível entre o nome do pedido e o botão */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Botão Ver Mais */}
                <Button variant="outlined" size="small">
                  Ver mais
                </Button>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {pedido.produtos.map((produto, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '60px', height: '60px', marginRight: 2 }}>
                  <Image src={produto.imagem} alt={produto.nome} width={60} height={60} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{produto.nome}</Typography>
                  <Typography variant="body2">Valor: {produto.valor}</Typography>
                  <Typography variant="body2">Quantidade: {produto.quantidade}</Typography>
                </Box>
              </Box>
            ))}
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 2 }}>
              <IconButton>
                <PlaceIcon sx={{ color: '#8a0303' }} />
              </IconButton>
              <Typography variant="body2">
                Rua João Amaral, 150 - São Paulo/SP
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MinhasComprasPage;
