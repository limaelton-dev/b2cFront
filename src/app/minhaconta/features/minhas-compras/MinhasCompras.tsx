import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OrderCard from '../../components/ui/OrderCard';
import { CompraType } from '../../types';
import headphoneImage from '../../../assets/img/headphone.png';

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
        <Box sx={{ pt: 3 }}>
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtra os pedidos com base na aba selecionada e no termo de pesquisa
  const filteredPedidos = pedidos.filter(pedido => {
    // Filtra por status com base na aba selecionada
    if (tabValue === 1 && pedido.status !== 'A caminho') return false;
    if (tabValue === 2 && pedido.status !== 'Entregue') return false;
    if (tabValue === 3 && pedido.status !== 'Cancelada') return false;
    
    // Filtra por termo de pesquisa
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const hasProdutoMatch = pedido.produtos.some(produto => 
        produto.nome.toLowerCase().includes(searchTermLower)
      );
      const hasIdMatch = pedido.id.toString().includes(searchTerm);
      
      return hasProdutoMatch || hasIdMatch;
    }
    
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#102d57',
            fontWeight: 500,
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
            width: 300,
            border: '1px solid #e0e0e0',
            boxShadow: 'none',
            borderRadius: '8px'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar pedidos..."
            inputProps={{ 'aria-label': 'buscar pedidos' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '.MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minWidth: 'auto',
              px: 3,
            },
            '.Mui-selected': {
              color: '#102d57',
            },
            '.MuiTabs-indicator': {
              backgroundColor: '#102d57',
            }
          }}
        >
          <Tab label="Todos" />
          <Tab label="Em andamento" />
          <Tab label="Entregues" />
          <Tab label="Cancelados" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map(pedido => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              mt: 2
            }}
          >
            <Typography 
              variant="body1"
              sx={{ 
                color: '#666'
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
              py: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              mt: 2
            }}
          >
            <Typography 
              variant="body1"
              sx={{ 
                color: '#666'
              }}
            >
              Nenhum pedido em andamento.
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
              py: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              mt: 2
            }}
          >
            <Typography 
              variant="body1"
              sx={{ 
                color: '#666'
              }}
            >
              Nenhum pedido entregue.
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map(pedido => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              mt: 2
            }}
          >
            <Typography 
              variant="body1"
              sx={{ 
                color: '#666'
              }}
            >
              Nenhum pedido cancelado.
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default MinhasCompras; 