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
        width: '100%', 
        minHeight: '150px' // Adiciona uma altura mínima para os cartões
      }}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box component="div" sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '20px'}}>
          <Box component="div" >
            <Typography variant="h6" component="div">
              Endereço
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              {address}
            </Typography>
          </Box>

          <Box component="div" >
            <Box component="div">
              <Typography variant="h6" component="div">
                Cidade/Estado
              </Typography>
              <Typography variant="body2" component="div" color="text.secondary">
                {city} - {state}
              </Typography>
            </Box>

          </Box>
        </Box>

        <Box component="div">
          <Button variant="text">Alterar</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCardAddress;
