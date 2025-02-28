import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EnderecoType } from '../../types';

interface AddressCardProps {
  endereco: EnderecoType;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ 
  endereco, 
  onEdit, 
  onDelete,
  onSetDefault
}) => {
  const { address, bairro, city, state, cep, isPrincipal } = endereco;
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {isPrincipal && (
        <Chip 
          label="Principal" 
          size="small"
          color="primary"
          sx={{ 
            position: 'absolute', 
            top: '-10px', 
            right: '16px',
            backgroundColor: '#102d57',
            fontWeight: 500,
            fontSize: '0.7rem'
          }}
        />
      )}
      
      <CardContent 
        sx={{ 
          padding: '24px',
          '&:last-child': { paddingBottom: '24px' }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ color: '#102d57', mr: 1, fontSize: '20px' }} />
              <Typography 
                sx={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666'
                }}
              >
                Endereço
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: '16px',
                color: '#333',
                ml: '28px'
              }}
            >
              {address}
              {bairro && `, ${bairro}`}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationCityIcon sx={{ color: '#102d57', mr: 1, fontSize: '20px' }} />
              <Typography 
                sx={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666'
                }}
              >
                Cidade/Estado
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: '16px',
                color: '#333',
                ml: '28px'
              }}
            >
              {city} - {state}
              {cep && `, ${cep}`}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 1,
              mt: 1
            }}
          >
            {!isPrincipal && onSetDefault && (
              <Button 
                variant="text" 
                size="small"
                onClick={onSetDefault}
                sx={{ 
                  color: '#102d57',
                  fontSize: '12px'
                }}
              >
                Definir como principal
              </Button>
            )}
            
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddressCard; 