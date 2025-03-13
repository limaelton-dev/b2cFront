import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import InfoCard from '../../components/ui/InfoCard';
import LoadingState from '../../components/ui/LoadingState';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WcIcon from '@mui/icons-material/Wc';
import { ProfilePF, ProfilePJ, User } from '../../../types/user';
import EditProfileModal from './EditProfileModal';
import { useUser } from '../../../hooks/useUser';

// Componente para exibir mensagem quando um campo está vazio
const EmptyFieldMessage = ({ field }: { field: string }) => (
  <Tooltip title={`Clique em "Alterar" para adicionar seu ${field.toLowerCase()}`}>
    <Typography sx={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}>
      Não informado
    </Typography>
  </Tooltip>
);

const renderFieldValue = (value: string | null, field: string) => {
  return value ? value : <EmptyFieldMessage field={field} />;
};

const formatGender = (gender: string | null) => {
  if (!gender) return null;

  const genderMap: Record<string, string> = {
    'M': 'Masculino',
    'F': 'Feminino',
    'O': 'Outro'
  };

  return genderMap[gender] || gender;
};


const DadosPessoais: React.FC = () => {
  const { user, loading, error } = useUser({ includeDetails: true});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  let fullName: string | null = null;
  let cpfCnpj: string | null = null;
  let birthDate: string | null = null;
  let gender: string | null = null;
  let fieldLabelCpfCnpj = 'CPF';

  if(user.profile) {
    if(user.profile_type === 'PF') {
      const profilePF = user.profile as ProfilePF;
      fullName = profilePF.full_name;
      cpfCnpj = profilePF.cpf;
      birthDate = profilePF.birth_date;
      gender = profilePF.gender;
      fieldLabelCpfCnpj = 'CPF';
    } else if(user.profile_type === 'PJ') {
      const profilePJ = user.profile as ProfilePJ;
      fullName = profilePJ.company_name;
      fieldLabelCpfCnpj = 'CNPJ';
    }
  }

  const phoneNumber = user?.phone && user.phone.length > 0 ? user.phone[0].number : null;




  return (
    <LoadingState loading={loading} error={error}>
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
              description={renderFieldValue(fullName, 'Nome')}
              icon={<PersonIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            />

            <InfoCard
              label="Data de Nascimento"
              description={renderFieldValue(birthDate, 'Data de Nascimento')}
              
              icon={<CakeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            />

            <InfoCard
              label="CPF"
              description={renderFieldValue(cpfCnpj, 'CPF')}
              icon={<BadgeIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            // onAction={() => handleEdit('cpf')}
            />

            <InfoCard
              label="E-mail"
              description={renderFieldValue(user?.email || null, 'E-mail')}
              icon={<EmailIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            />

            <InfoCard
              label="Telefone"
              description={renderFieldValue(phoneNumber, 'Telefone')}
              icon={<PhoneIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            />

            <InfoCard
              label="Gênero"
              description={renderFieldValue(formatGender(gender), 'Gênero')}
              icon={<WcIcon sx={{ color: '#102d57', fontSize: 20 }} />}
            />
          </Box>
        </Box>
      </Box>

      {/* Modal de edição de perfil */}
      {/* <EditProfileModal 
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        userData={user}
        onSave={(data) => {
          console.log("Salvando dados:", data);
          handleCloseEditModal();
        }}
        loading={false}
      /> */}
    </LoadingState>
  );
};

export default DadosPessoais; 