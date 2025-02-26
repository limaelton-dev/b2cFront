import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PlaceIcon from '@mui/icons-material/Place';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';
import Image from 'next/image';
import headphoneImage from '../../assets/img/headphone.png';
import { motion, AnimatePresence } from 'framer-motion';

const MinhasComprasPage = () => {
  const pedidos = [
    {
      id: 1,
      produtos: [
        { nome: 'HeadPhone C3TECH p2', valor: 'R$ 3500,00', quantidade: 3, imagem: headphoneImage },
        { nome: 'HeadPhone LOGITECH p2', valor: 'R$ 1500,00', quantidade: 2, imagem: headphoneImage },
      ],
      status: 'A caminho',
      data: '15/10/2024',
    },
    {
      id: 2,
      produtos: [
        { nome: 'Produto 3', valor: 'R$ 1500,00', quantidade: 1, imagem: headphoneImage },
      ],
      status: 'Entregue',
      data: '10/05/2024',
    },
    {
      id: 3,
      produtos: [
        { nome: 'Produto 4', valor: 'R$ 1500,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Cancelada',
      data: '10/05/2023',
    },
    {
      id: 4,
      produtos: [
        { nome: 'Produto 4', valor: 'R$ 1500,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Cancelada',
      data: '05/03/2024',
    },
    {
      id: 5,
      produtos: [
        { nome: 'Produto 4', valor: 'R$ 1500,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Cancelada',
      data: '23/02/2022',
    },
  ];

  const [expandedPedido, setExpandedPedido] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregue':
        return { color: '#5dc44b', bgColor: '#edf7eb' };
      case 'A caminho':
        return { color: '#3a58cf', bgColor: '#eef0fa' };
      case 'Cancelada':
        return { color: '#bf3737', bgColor: '#fbeaea' };
      default:
        return { color: 'black', bgColor: '#f5f5f5' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Entregue':
        return <CheckCircleIcon sx={{ width: '16px' }} />;
      case 'A caminho':
        return <LocalShippingIcon sx={{ width: '16px' }} />;
      case 'Cancelada':
        return <CancelIcon sx={{ width: '16px' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#102d57',
          fontWeight: 500,
          mb: 3
        }}
      >
        Minhas Compras
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={3}>
        {pedidos.map((pedido) => {
          const statusStyle = getStatusColor(pedido.status);
          
          return (
            <motion.div
              key={pedido.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ padding: 3 }}>
                  {/* Cabeçalho do Pedido */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={getStatusIcon(pedido.status)}
                        label={pedido.status}
                        sx={{
                          backgroundColor: statusStyle.bgColor,
                          color: statusStyle.color,
                          '& .MuiChip-icon': {
                            color: statusStyle.color
                          }
                        }}
                      />
                      <Typography 
                        sx={{ 
                          color: '#666',
                          fontSize: '14px'
                        }}
                      >
                        Pedido realizado em {pedido.data}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Produtos */}
                  <Box>
                    {/* Primeiro Produto */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box 
                          sx={{ 
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Image 
                            src={pedido.produtos[0].imagem} 
                            alt={pedido.produtos[0].nome} 
                            width={60} 
                            height={60}
                            style={{ objectFit: 'contain' }}
                          />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
                            {pedido.produtos[0].nome}
                          </Typography>
                          <Typography sx={{ fontSize: '14px', color: '#666', mt: 0.5 }}>
                            {pedido.produtos[0].valor} • {pedido.produtos[0].quantidade} un
                          </Typography>
                        </Box>
                      </Box>

                      {pedido.produtos.length > 1 && (
                        <Button
                          endIcon={expandedPedido === pedido.id ? 
                            <KeyboardArrowUpIcon /> : 
                            <KeyboardArrowDownIcon />
                          }
                          onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
                          sx={{
                            color: '#102d57',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {expandedPedido === pedido.id ? 'Ver menos' : `Ver mais ${pedido.produtos.length - 1} produtos`}
                        </Button>
                      )}
                    </Box>

                    {/* Produtos Adicionais */}
                    <AnimatePresence>
                      {expandedPedido === pedido.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {pedido.produtos.slice(1).map((produto, index) => (
                            <Box 
                              key={index}
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                pl: 2,
                                borderLeft: '2px solid #f0f0f0'
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 80,
                                  height: 80,
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  backgroundColor: '#f5f5f5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Image 
                                  src={produto.imagem} 
                                  alt={produto.nome} 
                                  width={60} 
                                  height={60}
                                  style={{ objectFit: 'contain' }}
                                />
                              </Box>
                              <Box>
                                <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
                                  {produto.nome}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#666', mt: 0.5 }}>
                                  {produto.valor} • {produto.quantidade} un
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Endereço de Entrega */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    color: '#666'
                  }}>
                    <PlaceIcon sx={{ color: '#102d57', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '14px' }}>
                      Rua João Amaral, 150 - São Paulo/SP
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default MinhasComprasPage;
