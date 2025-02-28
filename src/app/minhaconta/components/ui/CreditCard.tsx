import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { CartaoType } from '../../types';

interface CreditCardProps {
  cartao: CartaoType;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ cartao, onEdit, onDelete }) => {
  const { nome, numero, validade, cvv } = cartao;
  
  // Função para mascarar o número do cartão
  const maskedNumber = () => {
    if (!numero) return '';
    return '**** '.repeat(3) + numero.slice(-4);
  };
  
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ padding: '24px', '&:last-child': { paddingBottom: '24px' } }}>
        <Box sx={{ mb: 2 }}>
          <Cards
            number={numero}
            name={nome}
            expiry={validade.replace('/', '')}
            cvc={cvv}
            focused=""
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '14px',
              color: '#666',
              mb: 0.5
            }}
          >
            Número do cartão
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '1px',
              mb: 2
            }}
          >
            {maskedNumber()}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '14px',
                  color: '#666',
                  mb: 0.5
                }}
              >
                Titular
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '16px',
                  fontWeight: 500,
                  textTransform: 'uppercase'
                }}
              >
                {nome}
              </Typography>
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '14px',
                  color: '#666',
                  mb: 0.5
                }}
              >
                Validade
              </Typography>
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                {validade}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 1,
            mt: 3
          }}
        >
          {onEdit && (
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              onClick={onEdit}
              sx={{ 
                borderColor: '#102d57',
                color: '#102d57',
                '&:hover': {
                  borderColor: '#102d57',
                  backgroundColor: 'rgba(16, 45, 87, 0.04)',
                }
              }}
            >
              Editar
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outlined" 
              size="small"
              color="error"
              startIcon={<DeleteOutlineIcon fontSize="small" />}
              onClick={onDelete}
            >
              Excluir
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreditCard; 