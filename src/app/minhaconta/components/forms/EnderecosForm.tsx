import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const EnderecosForm = () => {
  const [formData, setFormData] = useState({
    endereco: '',
    cidade: '',
    cep: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., sending data to the backend)
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Endereço"
        name="endereco"
        value={formData.endereco}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Cidade"
        name="cidade"
        value={formData.cidade}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="CEP"
        name="cep"
        value={formData.cep}
        onChange={handleChange}
        fullWidth
      />
      <Button type="submit" variant="contained">Salvar Endereço</Button>
    </Box>
  );
};

export default EnderecosForm;
