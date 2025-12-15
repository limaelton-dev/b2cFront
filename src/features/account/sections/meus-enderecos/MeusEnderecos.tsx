'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { Add, PlaceOutlined } from '@mui/icons-material';
import AddressCard from '../../components/layout/ui/AddressCard';
import LoadingState from '../../components/layout/ui/LoadingState';
import { useUserAddresses } from '../../hooks/useUserAddresses';
import AddressFormModal from './AddressFormModal';
import { EnderecoType } from '../../types';

const THEME_COLOR = '#252d5f';

const MeusEnderecos: React.FC = () => {
    const {
        enderecos,
        loading,
        updating,
        error,
        linkedAddresses,
        refreshAddresses,
        setDefaultAddress,
        deleteAddress,
        addAddress,
        updateAddress,
    } = useUserAddresses();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<EnderecoType | null>(null);

    const handleEdit = (id: number) => {
        const addressToEdit = enderecos.find((endereco) => endereco.id === id);
        if (addressToEdit) {
            setSelectedAddress(addressToEdit);
            setIsFormModalOpen(true);
        }
    };

    const handleDelete = async (id: number) => {
        if (linkedAddresses.includes(id)) {
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
            await deleteAddress(id);
        }
    };

    const handleSetDefault = async (id: number) => {
        await setDefaultAddress(id);
    };

    const handleAddNew = () => {
        setSelectedAddress(null);
        setIsFormModalOpen(true);
    };

    const handleCloseModal = () => {
        if (updating) {
            if (window.confirm('Há alterações não salvas. Deseja realmente fechar o formulário?')) {
                setIsFormModalOpen(false);
                setSelectedAddress(null);
            }
        } else {
            setIsFormModalOpen(false);
            setSelectedAddress(null);
        }
    };

    const handleSaveAddress = async (addressData: Partial<EnderecoType>) => {
        if (selectedAddress) {
            await updateAddress(selectedAddress.id, addressData);
        } else {
            await addAddress(addressData);
        }
    };

    return (
        <LoadingState loading={loading} error={error} onRetry={refreshAddresses}>
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
                        Meus Endereços
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddNew}
                        disabled={updating}
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
                        Novo Endereço
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
                        {enderecos.length > 0 ? (
                            <Grid container spacing={2}>
                                {enderecos.map((endereco) => (
                                    <Grid item xs={12} md={6} key={endereco.id}>
                                        <AddressCard
                                            endereco={endereco}
                                            onEdit={() => handleEdit(endereco.id)}
                                            onDelete={() => handleDelete(endereco.id)}
                                            onSetDefault={
                                                !endereco.is_default
                                                    ? () => handleSetDefault(endereco.id)
                                                    : undefined
                                            }
                                            linkedToOrders={linkedAddresses.includes(endereco.id)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 8,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(37, 45, 95, 0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <PlaceOutlined sx={{ fontSize: 36, color: '#999' }} />
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{ color: '#666', mb: 2, textAlign: 'center' }}
                                >
                                    Você ainda não possui endereços cadastrados.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddNew}
                                    disabled={updating}
                                    sx={{
                                        borderColor: THEME_COLOR,
                                        color: THEME_COLOR,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#1a2147',
                                            bgcolor: 'rgba(37, 45, 95, 0.04)',
                                        },
                                    }}
                                >
                                    Adicionar Endereço
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>

            <AddressFormModal
                open={isFormModalOpen}
                onClose={handleCloseModal}
                address={selectedAddress}
                onSave={handleSaveAddress}
                loading={updating}
            />
        </LoadingState>
    );
};

export default MeusEnderecos;
