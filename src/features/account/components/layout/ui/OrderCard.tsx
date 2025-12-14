import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  IconButton, 
  Chip, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion, AnimatePresence } from 'framer-motion';
import { CompraType, OrderStatusDisplay } from '../../../types';
import Image from 'next/image';
import NoImage from '@/assets/img/noimage.png';

interface OrderCardProps {
  pedido: CompraType;
}

const OrderCard: React.FC<OrderCardProps> = ({ pedido }) => {
  const [expanded, setExpanded] = useState(false);
  const { id, partnerOrderId, produtos, status, data, valorTotal } = pedido;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'A caminho':
        return <LocalShippingIcon sx={{ fontSize: '13px' }} />;
      case 'Entregue':
        return <CheckCircleIcon sx={{ fontSize: '13px' }} />;
      case 'Cancelada':
        return <CancelIcon sx={{ fontSize: '13px' }} />;
      case 'Processando':
        return <ScheduleIcon sx={{ fontSize: '13px' }} />;
      case 'Aguardando Pagamento':
        return <PaymentIcon sx={{ fontSize: '13px' }} />;
      case 'Problema na Entrega':
        return <ErrorOutlineIcon sx={{ fontSize: '13px' }} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (): string => {
    switch (status) {
      case 'A caminho':
        return '#2196f3';
      case 'Entregue':
        return '#4caf50';
      case 'Cancelada':
        return '#f44336';
      case 'Processando':
        return '#ff9800';
      case 'Aguardando Pagamento':
        return '#9c27b0';
      case 'Problema na Entrega':
        return '#e91e63';
      default:
        return '#757575';
    }
  };
  
  const totalItems = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
  
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '7px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        mb: 1.75,
        '&:hover': {
          boxShadow: '0 2px 7px rgba(0,0,0,0.05)',
        }
      }}
    >
      <CardContent sx={{ padding: '14px', '&:last-child': { paddingBottom: '14px' } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.75
          }}
        >
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.9rem'
              }}
            >
              Pedido #{partnerOrderId || id}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666',
                fontSize: '0.75rem'
              }}
            >
              {data}
            </Typography>
            
            <Chip 
              icon={getStatusIcon()}
              label={status}
              size="small"
              sx={{ 
                backgroundColor: `${getStatusColor()}10`,
                color: getStatusColor(),
                fontWeight: 500,
                fontSize: '0.68rem',
                height: '19px',
                '.MuiChip-icon': {
                  color: getStatusColor()
                }
              }}
            />
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1.75
          }}
        >
          <Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666',
                fontSize: '0.75rem',
                mb: 0.35
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </Typography>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#102d57'
              }}
            >
              {valorTotal}
            </Typography>
          </Box>
          
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              padding: '3.5px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Divider sx={{ my: 1.75 }} />
              
              <List disablePadding>
                {produtos.map((produto, index) => (
                  <ListItem 
                    key={`produto-${produto.skuId || index}`}
                    disablePadding
                    sx={{ 
                      py: 0.85,
                      px: 0
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded"
                        sx={{ 
                          width: 45, 
                          height: 45,
                          borderRadius: '5px',
                          backgroundColor: '#f5f5f5'
                        }}
                      >
                        <Image 
                          src={produto.imagem || NoImage.src} 
                          alt={produto.nome}
                          width={45}
                          height={45}
                          style={{ objectFit: 'contain' }}
                          unoptimized={!produto.imagem}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '0.85rem'
                          }}
                        >
                          {produto.nome}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.35 }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: '#666',
                              fontSize: '0.75rem'
                            }}
                          >
                            Qtd: {produto.quantidade}
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '0.75rem'
                            }}
                          >
                            {produto.valor}
                          </Typography>
                        </Box>
                      }
                      sx={{ ml: 0.75 }}
                    />
                  </ListItem>
                ))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
