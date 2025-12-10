import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, Tooltip } from '@mui/material';
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
  linkedToOrders?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ 
  endereco, 
  onEdit, 
  onDelete,
  onSetDefault,
  linkedToOrders = false
}) => {
  const { street, number, complement, neighborhood, city, state, postal_code, is_default } = endereco;
  
  // Formatar o endereço completo
  const fullAddress = `${street}, ${number}${complement ? `, ${complement}` : ''}`;
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid #eaeaea',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }
      }}
    >
      {is_default && (
        <Chip 
          label="Principal" 
          size="small"
          color="primary"
          sx={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '12px',
            backgroundColor: '#102d57',
            fontWeight: 500,
            fontSize: '0.65rem',
            height: '20px'
          }}
        />
      )}
      
      {linkedToOrders && (
        <Chip 
          label="Usado em pedidos" 
          size="small"
          color="secondary"
          sx={{ 
            position: 'absolute', 
            top: is_default ? '16px' : '-8px', 
            right: '12px',
            backgroundColor: '#f57c00',
            fontWeight: 500,
            fontSize: '0.65rem',
            height: '20px'
          }}
        />
      )}
      
      <CardContent 
        sx={{ 
          padding: '16px',
          '&:last-child': { paddingBottom: '16px' }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOnIcon sx={{ color: '#102d57', mr: 1, fontSize: '18px' }} />
              <Typography 
                sx={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#666'
                }}
              >
                Endereço
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: '14px',
                color: '#333',
                ml: '28px'
              }}
            >
              {fullAddress}
              {neighborhood && `, ${neighborhood}`}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationCityIcon sx={{ color: '#102d57', mr: 1, fontSize: '18px' }} />
              <Typography 
                sx={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#666'
                }}
              >
                Cidade/Estado
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: '14px',
                color: '#333',
                ml: '28px'
              }}
            >
              {city} - {state}
              {postal_code && `, ${postal_code}`}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 1,
              mt: 0.5
            }}
          >
            {!is_default && onSetDefault && (
              <Button 
                variant="text" 
                size="small"
                onClick={onSetDefault}
                sx={{ 
                  color: '#102d57',
                  fontSize: '11px',
                  padding: '2px 8px'
                }}
              >
                Definir como principal
              </Button>
            )}
            
            {onEdit && (
              <Button 
                variant="text" 
                size="small"
                startIcon={<EditIcon fontSize="small" />}
                onClick={onEdit}
                sx={{ 
                  color: '#102d57',
                  fontSize: '11px',
                  padding: '2px 8px',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 45, 87, 0.04)'
                  }
                }}
              >
                Editar
              </Button>
            )}
            
            {onDelete && !linkedToOrders && (
              <Button 
                variant="text" 
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={onDelete}
                sx={{
                  fontSize: '11px',
                  padding: '2px 8px'
                }}
              >
                Excluir
              </Button>
            )}
            
            {linkedToOrders && (
              <Tooltip title="Este endereço não pode ser excluído porque está sendo usado em pedidos">
                <span>
                  <Button 
                    variant="text" 
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon fontSize="small" />}
                    disabled
                    sx={{
                      fontSize: '11px',
                      padding: '2px 8px'
                    }}
                  >
                    Excluir
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddressCard; 