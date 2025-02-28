import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressCard from '../../components/ui/AddressCard';
import { EnderecoType } from '../../types';

const MeusEnderecos: React.FC = () => {
  // Dados mockados - serão substituídos pela API
  const [enderecos, setEnderecos] = useState<EnderecoType[]>([
    {
      id: 1,
      address: 'Rua João Amaral, 150',
      bairro: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '68509-652',
      isPrincipal: true
    },
    {
      id: 2,
      address: 'Avenida Paulista, 1578',
      bairro: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      cep: '01310-200',
      isPrincipal: false
    }
  ]);

  const handleEdit = (id: number) => {
    console.log(`Editar endereço: ${id}`);
    // Aqui será implementada a lógica para editar o endereço
  };

  const handleDelete = (id: number) => {
    console.log(`Excluir endereço: ${id}`);
    // Aqui será implementada a lógica para excluir o endereço
    setEnderecos(enderecos.filter(endereco => endereco.id !== id));
  };

  const handleSetDefault = (id: number) => {
    console.log(`Definir endereço ${id} como principal`);
    // Aqui será implementada a lógica para definir o endereço como principal
    setEnderecos(enderecos.map(endereco => ({
      ...endereco,
      isPrincipal: endereco.id === id
    })));
  };

  const handleAddNew = () => {
    console.log('Adicionar novo endereço');
    // Aqui será implementada a lógica para adicionar um novo endereço
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
          Meus Endereços
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
          Novo Endereço
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }} />
      
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: '4px',
        p: 2.5
      }}>
        <Grid container spacing={2.5}>
          {enderecos.map((endereco) => (
            <Grid item xs={12} md={6} key={endereco.id}>
              <AddressCard 
                endereco={endereco}
                onEdit={() => handleEdit(endereco.id)}
                onDelete={() => handleDelete(endereco.id)}
                onSetDefault={!endereco.isPrincipal ? () => handleSetDefault(endereco.id) : undefined}
              />
            </Grid>
          ))}
        </Grid>
        
        {enderecos.length === 0 && (
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
              Você ainda não possui endereços cadastrados.
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
              Adicionar Endereço
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MeusEnderecos; 