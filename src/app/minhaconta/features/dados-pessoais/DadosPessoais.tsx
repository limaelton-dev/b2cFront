import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import InfoCard from '../../components/ui/InfoCard';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DadosPessoaisType } from '../../types';

const DadosPessoais: React.FC = () => {
  // Dados mockados - serão substituídos pela API
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisType>({
    nome: 'João Alvino Silva',
    cpf: '581.728.380-85',
    email: 'joaosilva24@email.com',
    username: 'joaoSilva24',
    dob: '01/11/1985',
    phone: '+55 (42) 99059-9905',
  });

  const handleEdit = (field: keyof DadosPessoaisType) => {
    console.log(`Editar campo: ${field}`);
    // Aqui será implementada a lógica para editar o campo
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#102d57',
            fontWeight: 500,
          }}
        >
          Dados Pessoais
        </Typography>
        
        <Button 
          variant="contained"
          sx={{ 
            backgroundColor: '#102d57',
            '&:hover': {
              backgroundColor: '#0a1e3a',
            }
          }}
        >
          Editar Perfil
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="Nome completo" 
            description={dadosPessoais.nome} 
            icon={<PersonIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('nome')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="Data de Nascimento" 
            description={dadosPessoais.dob} 
            icon={<CakeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('dob')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="CPF" 
            description={dadosPessoais.cpf} 
            icon={<BadgeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('cpf')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="Username" 
            description={dadosPessoais.username} 
            icon={<AccountCircleIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('username')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="E-mail" 
            description={dadosPessoais.email} 
            icon={<EmailIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('email')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="Telefone" 
            description={dadosPessoais.phone} 
            icon={<PhoneIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            onAction={() => handleEdit('phone')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DadosPessoais; 