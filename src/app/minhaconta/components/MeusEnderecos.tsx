import React, { useState } from 'react';
import { Box } from '@mui/material';
import InfoCardAddress from '../components/InfoCardAddress';

const MeusEnderecos = () => {
  const [formData, setFormData] = useState({
    address: 'Quadra Dezenove, 150',
    bairro: 'Nova Marabá',
    city: 'Marabá',
    state: 'PA',
    cep: '68509-652'
  });

  return (
    <Box component="div" display="flex" flexWrap="wrap" gap={2} margin={3}>
      <InfoCardAddress address= {formData.address} city={formData.city} state={formData.state} />
    </Box>
  );
};

export default MeusEnderecos;
