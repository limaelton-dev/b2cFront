import React, { useState } from 'react';
import { Box } from '@mui/material';
import InfoCard from '../InfoCard';

const DadosPessoaisForm = () => {
  const [formData, setFormData] = useState({
    nome: 'João Alvino Silva',
    cpf: '581.728.380-85',
    email: 'joaosilva24@email.com',
    username: 'joaoSilva24',
    dob: '01/11/1985',
    phone: '+554299059905',
  });

  return (
    <Box component="div" display="flex" flexWrap="wrap" gap={2} margin={3}>
      <InfoCard label="Nome completo" description={formData.nome} />
      <InfoCard label="Data Nascimento" description={formData.dob} />
      <InfoCard label="CPF" description={formData.cpf} />
      <InfoCard label="Username" description={formData.username} />
      <InfoCard label="E-mail" description={formData.email} />
      <InfoCard label="Telefone" description={formData.phone} />
    </Box>
  );
};

export default DadosPessoaisForm;
