import React, { useState } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { Card as CardType } from '../../../types/card';

interface CreditCardProps {
  card: CardType;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ 
  card, 
  onEdit, 
  onDelete,
  onSetDefault
}) => {
  const { card_number, holder_name, expiration_date, is_default, brand } = card;
  const [isHovered, setIsHovered] = useState(false);

  // Extrai os 4 últimos dígitos do número do cartão
  const lastFourDigits = card_number.slice(-4);
  // Monta a string mascarada para exibição
  const maskedNumber = `**** **** **** ${lastFourDigits}`;

  // Caso a marca salva no banco não seja exatamente o que o `react-credit-cards-2` espera,
  // podemos mapear aqui. Exemplo simplificado:
  const brandMap: Record<string, string> = {
    visa: 'visa',
    master: 'mastercard',
    mastercard: 'mastercard',
    amex: 'amex',
    discover: 'discover',
    diners: 'dinersclub',
    jcb: 'jcb',
    unionpay: 'unionpay',
    maestro: 'maestro',
    hipercard: 'hipercard',
    elo: 'elo'
  };

  // Converte para minúsculo e tenta encontrar no dicionário
  const issuer = brandMap[brand.toLowerCase()] || '';

  return (
    <Box
      sx={{
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {is_default && (
        <Chip 
          icon={<StarIcon sx={{ fontSize: '14px' }} />}
          label="Principal" 
          size="small"
          color="primary"
          sx={{ 
            position: 'absolute', 
            top: -8, 
            left: 8, 
            zIndex: 10,
            backgroundColor: '#102d57',
            fontWeight: 500,
            fontSize: '0.65rem',
            height: '20px'
          }}
        />
      )}
      
      {isHovered && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            display: 'flex', 
            gap: 0.5,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            padding: '2px'
          }}
        >
          {!is_default && onSetDefault && (
            <IconButton 
              size="small"
              onClick={onSetDefault}
              sx={{ 
                color: '#ffc107',
                padding: '3px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                }
              }}
            >
              <StarIcon sx={{ fontSize: '18px' }} />
            </IconButton>
          )}
          
          {onEdit && (
            <IconButton 
              size="small"
              onClick={onEdit}
              sx={{ 
                color: '#102d57',
                padding: '3px',
                '&:hover': {
                  backgroundColor: 'rgba(16, 45, 87, 0.1)',
                }
              }}
            >
              <EditIcon sx={{ fontSize: '18px' }} />
            </IconButton>
          )}
          
          {onDelete && (
            <IconButton 
              size="small"
              color="error"
              onClick={onDelete}
              sx={{ padding: '3px' }}
            >
              <DeleteOutlineIcon sx={{ fontSize: '18px' }} />
            </IconButton>
          )}
        </Box>
      )}
      
      <Cards
        number={maskedNumber}
        name={holder_name}
        expiry={expiration_date.replace('/', '')}
        cvc="***"
        focused=""
        preview={true}
        issuer={issuer} 
      />
    </Box>
  );
};

export default CreditCard;
