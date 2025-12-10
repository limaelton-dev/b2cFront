import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OrderCard from '@/features/account/components/layout/ui/OrderCard';
import { CompraType } from '@/features/account/types';
import headphoneImage from '@/assets/img/headphone.png';

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

const MinhasCompras: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados mockados - serão substituídos pela API
  const [pedidos, setPedidos] = useState<CompraType[]>([
    {
      id: 1,
      produtos: [
        { nome: 'HeadPhone C3TECH p2', valor: 'R$ 350,00', quantidade: 3, imagem: headphoneImage },
        { nome: 'HeadPhone LOGITECH p2', valor: 'R$ 150,00', quantidade: 2, imagem: headphoneImage },
      ],
      status: 'A caminho',
      data: '15/10/2024',
    },
    {
      id: 2,
      produtos: [
        { nome: 'Produto 3', valor: 'R$ 150,00', quantidade: 1, imagem: headphoneImage },
      ],
      status: 'Entregue',
      data: '10/05/2024',
    },
    {
      id: 3,
      produtos: [
        { nome: 'Produto 4', valor: 'R$ 150,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Cancelada',
      data: '10/05/2023',
    },
    {
      id: 4,
      produtos: [
        { nome: 'Produto 5', valor: 'R$ 150,00', quantidade: 3, imagem: headphoneImage },
      ],
      status: 'Processando',
      data: '10/05/2023',
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Pesquisando por: ${searchTerm}`);
    // Aqui será implementada a lógica para pesquisar pedidos
  };

  // Filtrar pedidos com base no status e termo de pesquisa
  const filteredPedidos = pedidos.filter(pedido => {
    // Filtrar por status (tab)
    if (tabValue === 1 && pedido.status !== 'Entregue') return false;
    if (tabValue === 2 && pedido.status !== 'Cancelada') return false;
    
    // Filtrar por termo de pesquisa
    if (searchTerm && !pedido.id.toString().includes(searchTerm)) return false;
    
    return true;
  });

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
          {filteredPedidos.length > 0 ? (
            filteredPedidos.map(pedido => (
              <OrderCard key={pedido.id} pedido={pedido} />
            ))
          ) : (
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
                sx={{ 
                  color: '#666',
                  fontSize: '0.85rem'
                }}
              >
                Nenhum pedido encontrado.
              </Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {filteredPedidos.length > 0 ? (
            filteredPedidos.map(pedido => (
              <OrderCard key={pedido.id} pedido={pedido} />
            ))
          ) : (
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
                sx={{ 
                  color: '#666',
                  fontSize: '0.85rem'
                }}
              >
                Nenhum pedido entregue.
              </Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {filteredPedidos.length > 0 ? (
            filteredPedidos.map(pedido => (
              <OrderCard key={pedido.id} pedido={pedido} />
            ))
          ) : (
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
                sx={{ 
                  color: '#666',
                  fontSize: '0.85rem'
                }}
              >
                Nenhum pedido cancelado.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default MinhasCompras; 