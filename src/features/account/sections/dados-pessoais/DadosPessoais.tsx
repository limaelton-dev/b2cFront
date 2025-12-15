'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, Paper } from '@mui/material';
import InfoCard from '@/features/account/components/layout/ui/InfoCard';
import LoadingState from '@/features/account/components/layout/ui/LoadingState';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import { useUserPersonalData } from '@/features/account/hooks/useUserPersonalData';
import { DadosPessoaisType } from '@/features/account/types';
import EditProfileModal from './EditProfileModal';

const THEME_COLOR = '#252d5f';

const EmptyFieldMessage = ({ field }: { field: string }) => (
    <Tooltip title={`Clique em "Alterar" para adicionar seu ${field.toLowerCase()}`}>
        <Typography
            component="span"
            sx={{ color: '#999', fontStyle: 'italic', fontSize: '0.875rem' }}
        >
            Não informado
        </Typography>
    </Tooltip>
);

const DadosPessoais: React.FC = () => {
    const { dadosPessoais, loading, updating, error, refreshData, updateData } =
        useUserPersonalData();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<keyof DadosPessoaisType | null>(null);

    const handleEdit = (field: keyof DadosPessoaisType) => {
        setEditingField(field);
        setIsEditModalOpen(true);
    };

    const handleOpenEditModal = () => {
        setEditingField(null);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingField(null);
    };

    const handleSaveData = async (data: Partial<DadosPessoaisType>, type: 'profile' | 'user') => {
        await updateData(data, type);
    };

    const renderFieldValue = (value: string | null, field: string) => {
        return value ? value : <EmptyFieldMessage field={field} />;
    };

    const formatGender = (gender: string | null) => {
        if (!gender) return null;

        const genderMap: Record<string, string> = {
            M: 'Masculino',
            F: 'Feminino',
            O: 'Outro',
        };

        return genderMap[gender] || gender;
    };

    return (
        <LoadingState loading={loading} error={error} onRetry={refreshData}>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: THEME_COLOR,
                            fontWeight: 600,
                            fontSize: '1.25rem',
                        }}
                    >
                        Dados Pessoais
                    </Typography>

                    <Button
                        variant="contained"
                        disabled={updating}
                        onClick={handleOpenEditModal}
                        sx={{
                            bgcolor: THEME_COLOR,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 2.5,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#1a2147',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Editar Perfil
                    </Button>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid #e8e8e8',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <InfoCard
                            label="Primeiro Nome"
                            description={renderFieldValue(dadosPessoais.firstName ?? null, 'Primeiro Nome')}
                            icon={<PersonIcon />}
                            onAction={() => handleEdit('firstName')}
                        />

                        <InfoCard
                            label="Sobrenome"
                            description={renderFieldValue(dadosPessoais.lastName ?? null, 'Sobrenome')}
                            icon={<PersonIcon />}
                            onAction={() => handleEdit('lastName')}
                        />

                        <InfoCard
                            label="CPF"
                            description={renderFieldValue(dadosPessoais.cpf, 'CPF')}
                            icon={<BadgeIcon />}
                            onAction={() => handleEdit('cpf')}
                        />

                        <InfoCard
                            label="Data de Nascimento"
                            description={renderFieldValue(dadosPessoais.birth_date, 'Data de Nascimento')}
                            icon={<CakeIcon />}
                            onAction={() => handleEdit('birth_date')}
                        />

                        <InfoCard
                            label="Gênero"
                            description={renderFieldValue(formatGender(dadosPessoais.gender), 'Gênero')}
                            icon={<WcIcon />}
                            onAction={() => handleEdit('gender')}
                        />

                        <InfoCard
                            label="E-mail"
                            description={renderFieldValue(dadosPessoais.email, 'E-mail')}
                            icon={<EmailIcon />}
                            onAction={() => handleEdit('email')}
                        />

                        <InfoCard
                            label="Telefone"
                            description={renderFieldValue(dadosPessoais.phone, 'Telefone')}
                            icon={<PhoneIcon />}
                            onAction={() => handleEdit('phone')}
                        />
                    </Box>
                </Paper>
            </Box>

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
