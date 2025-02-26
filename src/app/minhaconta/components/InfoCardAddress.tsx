import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EditIcon from '@mui/icons-material/Edit';

interface InfoCardProps {
  city: string;
  state: string;
  address: string;
}

const InfoCardAddress: React.FC<InfoCardProps> = ({ city, state, address }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent 
        sx={{ 
          padding: '24px',
          '&:last-child': { paddingBottom: '24px' }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 3,
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}
        >
          <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <Box sx={{ minWidth: '200px' }}>
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
                  fontSize: '15px',
                  color: '#333',
                  pl: '28px'
                }}
              >
                {address}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '200px' }}>
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
                  fontSize: '15px',
                  color: '#333',
                  pl: '28px'
                }}
              >
                {city} - {state}
              </Typography>
            </Box>
          </Box>

          <Button 
            startIcon={<EditIcon sx={{ color: '#102d57' }} />}
            sx={{ 
              color: '#4C90F3',
              textTransform: 'none',
              fontSize: '14px',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Alterar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCardAddress;
