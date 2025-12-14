import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, InputBase, IconButton, Paper, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OrderCard from '@/features/account/components/layout/ui/OrderCard';
import { CompraType, OrderStatusDisplay } from '@/features/account/types';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/api/orders/types/order';
import { fetchOrders } from '@/api/orders/services/order-service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2.5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function mapOrderStatusToDisplay(status: OrderStatus): OrderStatusDisplay {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT:
      return 'Aguardando Pagamento';
    case OrderStatus.PENDING:
    case OrderStatus.INCOMPLETE:
    case OrderStatus.PAID_WAITING_SHIP:
    case OrderStatus.INVOICED:
    case OrderStatus.PAID_WAITING_DELIVERY:
      return 'Processando';
    case OrderStatus.IN_TRANSIT:
      return 'A caminho';
    case OrderStatus.CONCLUDED:
      return 'Entregue';
    case OrderStatus.CANCELED:
      return 'Cancelada';
    case OrderStatus.DELIVERY_ISSUE:
      return 'Problema na Entrega';
    default:
      return 'Processando';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function mapOrderToCompra(order: Order): CompraType {
  return {
    id: order.id,
    partnerOrderId: order.partnerOrderId,
    produtos: order.items.map(item => ({
      id: item.id,
      skuId: item.skuId,
      nome: item.title,
      valor: `R$ ${item.unitPrice.replace('.', ',')}`,
      quantidade: item.quantity
    })),
    status: mapOrderStatusToDisplay(order.status),
    data: formatDate(order.createdAt),
    valorTotal: `R$ ${order.grandTotal.replace('.', ',')}`
  };
}

const MinhasCompras: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidos, setPedidos] = useState<CompraType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const orders = await fetchOrders();
      const mappedOrders = orders.map(mapOrderToCompra);
      setPedidos(mappedOrders);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredPedidos = pedidos.filter(pedido => {
    if (tabValue === 1 && pedido.status !== 'Entregue') return false;
    if (tabValue === 2 && pedido.status !== 'Cancelada') return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = pedido.id.toString().includes(term);
      const matchesPartnerOrderId = pedido.partnerOrderId.toLowerCase().includes(term);
      if (!matchesId && !matchesPartnerOrderId) return false;
    }
    
    return true;
  });

  const renderOrderList = (emptyMessage: string) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 5,
            backgroundColor: 'rgba(244, 67, 54, 0.05)',
            borderRadius: '6px',
            mt: 2
          }}
        >
          <Typography 
            variant="body1"
            sx={{ color: '#f44336', fontSize: '0.85rem' }}
          >
            {error}
          </Typography>
        </Box>
      );
    }

    if (filteredPedidos.length > 0) {
      return filteredPedidos.map(pedido => (
        <OrderCard key={pedido.id} pedido={pedido} />
      ));
    }

    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '6px',
          mt: 2
        }}
      >
        <Typography 
          variant="body1"
          sx={{ color: '#666', fontSize: '0.85rem' }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#102d57',
            fontWeight: 500,
            fontSize: '1.15rem'
          }}
        >
          Minhas Compras
        </Typography>
        
        <Paper
          component="form"
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: 290,
            border: '1px solid #eaeaea',
            boxShadow: 'none',
            borderRadius: '4px',
            height: '36px'
          }}
          onSubmit={handleSearch}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '0.8rem' }}
            placeholder="Pesquisar por número do pedido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton 
            type="submit" 
            sx={{ p: '6px', color: '#102d57' }} 
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="pedidos tabs"
          sx={{
            '& .MuiTab-root': {
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 500,
              color: '#666',
              px: 2.5,
              minWidth: 'auto',
              '&.Mui-selected': {
                color: '#102d57',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#102d57',
            }
          }}
        >
          <Tab label="Todos os pedidos" />
          <Tab label="Entregues" />
          <Tab label="Cancelados" />
        </Tabs>
      </Box>
      
      <Box sx={{ backgroundColor: 'white', p: 2.5, borderRadius: '4px' }}>
        <TabPanel value={tabValue} index={0}>
          {renderOrderList('Nenhum pedido encontrado.')}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderOrderList('Nenhum pedido entregue.')}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {renderOrderList('Nenhum pedido cancelado.')}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default MinhasCompras;
