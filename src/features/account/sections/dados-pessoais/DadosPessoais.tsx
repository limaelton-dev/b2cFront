import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import InfoCard from '@/features/account/components/layout/ui/InfoCard';
import LoadingState from '@/features/account/components/layout/ui/LoadingState';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WcIcon from '@mui/icons-material/Wc';
import { useUserPersonalData } from '@/features/account/hooks/useUserPersonalData';
import { DadosPessoaisType } from '@/features/account/types';
import EditProfileModal from './EditProfileModal';

// Componente para exibir mensagem quando um campo está vazio
const EmptyFieldMessage = ({ field }: { field: string }) => (
  <Tooltip title={`Clique em "Alterar" para adicionar seu ${field.toLowerCase()}`}>
    <Typography sx={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}>
      Não informado
    </Typography>
  </Tooltip>
);

const DadosPessoais: React.FC = () => {
  const { dadosPessoais, loading, updating, error, refreshData, updateData } = useUserPersonalData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof DadosPessoaisType | null>(null);

  const handleEdit = (field: keyof DadosPessoaisType) => {
    setEditingField(field);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setEditingField(null); // Edição completa do perfil
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingField(null);
  };

  const handleSaveData = async (data: Partial<DadosPessoaisType>, type: 'profile' | 'user') => {
    await updateData(data, type);
  };

  // Função para renderizar o valor do campo ou uma mensagem quando estiver vazio
  const renderFieldValue = (value: string | null, field: string) => {
    return value ? value : <EmptyFieldMessage field={field} />;
  };

  // Função para formatar o gênero
  const formatGender = (gender: string | null) => {
    if (!gender) return null;
    
    const genderMap: Record<string, string> = {
      'M': 'Masculino',
      'F': 'Feminino',
      'O': 'Outro'
    };
    
    return genderMap[gender] || gender;
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
            onClick={handleOpenEditModal}
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
              description={renderFieldValue(dadosPessoais.full_name, 'Nome')} 
              icon={<PersonIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('full_name')}
            />
            
            <InfoCard 
              label="Data de Nascimento" 
              description={renderFieldValue(dadosPessoais.birth_date, 'Data de Nascimento')} 
              icon={<CakeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('birth_date')}
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
            
            <InfoCard 
              label="Gênero" 
              description={renderFieldValue(formatGender(dadosPessoais.gender), 'Gênero')} 
              icon={<WcIcon sx={{ color: '#102d57', fontSize: 20 }} />}
              onAction={() => handleEdit('gender')}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Modal de edição de perfil */}
      <EditProfileModal 
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        userData={dadosPessoais}
        onSave={handleSaveData}
        loading={updating}
      />
    </LoadingState>
  );
};

export default DadosPessoais; 