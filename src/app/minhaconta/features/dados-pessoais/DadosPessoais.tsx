import React from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import InfoCard from '../../components/ui/InfoCard';
import LoadingState from '../../components/ui/LoadingState';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useUserPersonalData from '../../hooks/useUserPersonalData';
import { DadosPessoaisType } from '../../types';

// Componente para exibir mensagem quando um campo está vazio
const EmptyFieldMessage = ({ field }: { field: string }) => (
  <Tooltip title={`Clique em "Alterar" para adicionar seu ${field.toLowerCase()}`}>
    <Typography sx={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}>
      Não informado
    </Typography>
  </Tooltip>
);

const DadosPessoais: React.FC = () => {
  const { dadosPessoais, loading, updating, error, refreshData } = useUserPersonalData();

  const handleEdit = (field: keyof DadosPessoaisType) => {
    console.log(`Editar campo: ${field}`);
    // Aqui será implementada a lógica para editar o campo
  };

  // Função para renderizar o valor do campo ou uma mensagem quando estiver vazio
  const renderFieldValue = (value: string, field: string) => {
    return value ? value : <EmptyFieldMessage field={field} />;
  };

  return (
    <LoadingState loading={loading} error={error} onRetry={refreshData}>
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#102d57',
              fontWeight: 500,
              fontSize: '1.15rem'
            }}
          >
            Dados Pessoais
          </Typography>
          
          <Button 
            variant="contained"
            disabled={updating}
            sx={{ 
              backgroundColor: '#102d57',
              fontSize: '0.8rem',
              padding: '6px 12px',
              '&:hover': {
                backgroundColor: '#0a1e3a',
              }
            }}
          >
            Editar Perfil
          </Button>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }} />
        
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: '4px',
          p: 2.5
        }}>
          <Box>
            <InfoCard 
              label="Nome completo" 
              description={renderFieldValue(dadosPessoais.nome, 'Nome')} 
              icon={<PersonIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('nome')}
            />
            
            <InfoCard 
              label="Data de Nascimento" 
              description={renderFieldValue(dadosPessoais.dob, 'Data de Nascimento')} 
              icon={<CakeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('dob')}
            />
            
            <InfoCard 
              label="CPF" 
              description={renderFieldValue(dadosPessoais.cpf, 'CPF')} 
              icon={<BadgeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('cpf')}
            />
            
            <InfoCard 
              label="Username" 
              description={renderFieldValue(dadosPessoais.username, 'Username')} 
              icon={<AccountCircleIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('username')}
            />
            
            <InfoCard 
              label="E-mail" 
              description={renderFieldValue(dadosPessoais.email, 'E-mail')} 
              icon={<EmailIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('email')}
            />
            
            <InfoCard 
              label="Telefone" 
              description={renderFieldValue(dadosPessoais.phone, 'Telefone')} 
              icon={<PhoneIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('phone')}
            />
          </Box>
        </Box>
      </Box>
    </LoadingState>
  );
};

export default DadosPessoais; 