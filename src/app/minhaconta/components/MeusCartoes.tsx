import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface Cartao {
  id: number;
  nome: string;
  numero: string;
  validade: string;
  cvv: string;
}

const MeusCartoes: React.FC = () => {
  const cartoes: Cartao[] = [
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
  ];

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
        Meus Cartões
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
          maxWidth: '100%'
        }}
      >
        {cartoes.map((cartao) => (
          <Box
            key={cartao.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '360px',
              margin: '0 auto'
            }}
          >
            <Cards
              number={cartao.numero}
              expiry={cartao.validade}
              name={cartao.nome}
              cvc={cartao.cvv}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 2,
                width: '100%'
              }}
            >
              <Button 
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#102d57',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Editar
              </Button>
              <Button 
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Remover
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MeusCartoes;
