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
import { motion, AnimatePresence } from 'framer-motion';
import { CompraType } from '../../types';
import Image from 'next/image';

interface OrderCardProps {
  pedido: CompraType;
}

const OrderCard: React.FC<OrderCardProps> = ({ pedido }) => {
  const [expanded, setExpanded] = useState(false);
  const { id, produtos, status, data } = pedido;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'A caminho':
        return <LocalShippingIcon sx={{ fontSize: '16px' }} />;
      case 'Entregue':
        return <CheckCircleIcon sx={{ fontSize: '16px' }} />;
      case 'Cancelada':
        return <CancelIcon sx={{ fontSize: '16px' }} />;
      case 'Processando':
        return <ScheduleIcon sx={{ fontSize: '16px' }} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'A caminho':
        return '#2196f3';
      case 'Entregue':
        return '#4caf50';
      case 'Cancelada':
        return '#f44336';
      case 'Processando':
        return '#ff9800';
      default:
        return '#757575';
    }
  };
  
  const totalItems = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
  const valorTotal = produtos.reduce((acc, produto) => {
    const valor = parseFloat(produto.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + (valor * produto.quantidade);
  }, 0);
  
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        mb: 3,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }
      }}
    >
      <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}
        >
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Pedido #{id}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666',
                fontSize: '14px'
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
            mt: 2
          }}
        >
          <Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666',
                fontSize: '14px',
                mb: 0.5
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </Typography>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 500,
                fontSize: '18px',
                color: '#102d57'
              }}
            >
              {`R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
            </Typography>
          </Box>
          
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
              <Divider sx={{ my: 2 }} />
              
              <List disablePadding>
                {produtos.map((produto, index) => (
                  <ListItem 
                    key={`produto-${index}`}
                    disablePadding
                    sx={{ 
                      py: 1,
                      px: 0
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          borderRadius: '8px',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <Image 
                          src={produto.imagem} 
                          alt={produto.nome}
                          width={60}
                          height={60}
                          style={{ objectFit: 'contain' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '15px'
                          }}
                        >
                          {produto.nome}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: '#666',
                              fontSize: '14px'
                            }}
                          >
                            Qtd: {produto.quantidade}
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '14px'
                            }}
                          >
                            {produto.valor}
                          </Typography>
                        </Box>
                      }
                      sx={{ ml: 1 }}
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