import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const DadosPessoaisForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here (e.g., sending data to the backend)
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Telefone"
        name="telefone"
        value={formData.telefone}
        onChange={handleChange}
        fullWidth
      />
      <Button type="submit" variant="contained">Salvar Dados</Button>
    </Box>
  );
};

export default DadosPessoaisForm;
