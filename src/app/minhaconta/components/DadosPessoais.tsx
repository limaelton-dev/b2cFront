import React, { useState } from 'react';
import { Box } from '@mui/material';
import InfoCardPersonalData from '../../minhaconta/components/InfoCardPersonalData';

const DadosPessoais = () => {
  const [formData, setFormData] = useState({
    nome: 'João Alvino Silva',
    cpf: '581.728.380-85',
    email: 'joaosilva24@email.com',
    username: 'joaoSilva24',
    dob: '01/11/1985',
    phone: '+554299059905',
  });

  return (
    <Box component="div" display="flex" flexWrap="wrap" gap={2} margin={1} sx={{ flexShrink: '0'}}>
      <InfoCardPersonalData label="Nome completo" description={formData.nome} />
      <InfoCardPersonalData label="Data Nascimento" description={formData.dob} />
      <InfoCardPersonalData label="CPF" description={formData.cpf} />
      <InfoCardPersonalData label="Username" description={formData.username} />
      <InfoCardPersonalData label="E-mail" description={formData.email} />
      <InfoCardPersonalData label="Telefone" description={formData.phone} />
    </Box>
  );
};

export default DadosPessoais;
