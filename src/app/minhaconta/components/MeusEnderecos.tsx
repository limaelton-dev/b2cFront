import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import InfoCardAddress from './InfoCardAddress';

const MeusEnderecos = () => {
  const [formData, setFormData] = useState({
    address: 'Rua João Amaral, 150',
    bairro: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    cep: '68509-652'
  });

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
        Meus Endereços
      </Typography>
      
      <Box 
        component="div" 
        display="flex" 
        flexWrap="wrap" 
        gap={2}
        sx={{ flexShrink: '0' }}
      >
        <InfoCardAddress 
          address={formData.address} 
          city={formData.city} 
          state={formData.state}
        />
      </Box>
    </Box>
  );
};

export default MeusEnderecos;
