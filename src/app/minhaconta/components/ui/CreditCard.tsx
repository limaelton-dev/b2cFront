import React, { useState } from 'react';
import { Box, IconButton, Card, CardContent } from '@mui/material';
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
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Box
      sx={{
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        number={numero}
        name={nome}
        expiry={validade.replace('/', '')}
        cvc={cvv}
        focused=""
      />
    </Box>
  );
};

export default CreditCard; 