import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface Cartao {
  id: number;
  nome: string;
  numero: string;
  validade: string;
}

const MeusCartoes: React.FC = () => {
  const cartoes: Cartao[] = [
    { id: 1, nome: 'Cartão Visa', numero: '**** **** **** 1234', validade: '12/24' },
    { id: 2, nome: 'Cartão MasterCard', numero: '**** **** **** 5678', validade: '08/23' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Meus Cartões
      </Typography>
      {cartoes.map((cartao) => (
        <Card key={cartao.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CreditCardIcon sx={{ marginRight: 1, color: '#4C90F3' }} />
              <Typography variant="subtitle1">{cartao.nome}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Número: {cartao.numero}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Validade: {cartao.validade}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Editar
            </Button>
            <Button size="small" color="error">
              Remover
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default MeusCartoes;
