import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

interface InfoCardProps {
  city: string;
  state : string;
  address: string;
}

const InfoCardAddress: React.FC<InfoCardProps> = ({ city, state, address }) => {
  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        width: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '20px'}}>
          <Box component="div" >
            <Typography sx={{ fontSize: '12px' }}>
              Endereço
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ fontSize: '15px' }}
            >
              {address}
            </Typography>
          </Box>

          <Box component="div" >
            <Box component="div">
              <Typography sx={{ fontSize: '12px' }} >
                Cidade/Estado
              </Typography>
              <Typography 
                color="text.secondary"
                sx={{ fontSize: '15px' }}
              >
                {city} - {state}
              </Typography>
            </Box>

          </Box>
        </Box>

        <Box component="div">
          <Button 
            variant="text"
            sx={{ 
              fontSize: '12px', 
              padding: '8px 16px', 
              minWidth: '75px', 
              height: '40px'
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
