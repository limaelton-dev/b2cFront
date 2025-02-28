import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreditCard from '../../components/ui/CreditCard';
import { CartaoType } from '../../types';

const MeusCartoes: React.FC = () => {
  // Dados mockados - serão substituídos pela API
  const [cartoes, setCartoes] = useState<CartaoType[]>([
    { 
      id: 1, 
      nome: 'João Silva', 
      numero: '4111111111111111', 
      validade: '12/24',
      cvv: '123'
    },
    { 
      id: 2, 
      nome: 'João Silva', 
      numero: '5555555555554444', 
      validade: '08/23',
      cvv: '321'
    },
  ]);

  const handleEdit = (id: number) => {
    console.log(`Editar cartão: ${id}`);
    // Aqui será implementada a lógica para editar o cartão
  };

  const handleDelete = (id: number) => {
    console.log(`Excluir cartão: ${id}`);
    // Aqui será implementada a lógica para excluir o cartão
    setCartoes(cartoes.filter(cartao => cartao.id !== id));
  };

  const handleAddNew = () => {
    console.log('Adicionar novo cartão');
    // Aqui será implementada a lógica para adicionar um novo cartão
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
          Meus Cartões
        </Typography>
        
        <Button 
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ 
            backgroundColor: '#102d57',
            fontSize: '0.8rem',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: '#0a1e3a',
            }
          }}
        >
          Novo Cartão
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }} />
      
      <Box sx={{ 
        p: 0.5
      }}>
        <Grid container spacing={2.5}>
          {cartoes.map((cartao) => (
            <Grid item xs={12} sm={6} md={4} key={cartao.id}>
              <CreditCard 
                cartao={cartao}
                onEdit={() => handleEdit(cartao.id)}
                onDelete={() => handleDelete(cartao.id)}
              />
            </Grid>
          ))}
        </Grid>
        
        {cartoes.length === 0 && (
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
                fontSize: '0.85rem',
                mb: 2
              }}
            >
              Você ainda não possui cartões cadastrados.
            </Typography>
            <Button 
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{ 
                backgroundColor: '#102d57',
                fontSize: '0.8rem',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: '#0a1e3a',
                }
              }}
            >
              Adicionar Cartão
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MeusCartoes; 