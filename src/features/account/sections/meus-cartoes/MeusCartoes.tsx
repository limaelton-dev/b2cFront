'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    Skeleton,
} from '@mui/material';
import { Add, CreditCardOutlined } from '@mui/icons-material';
import CreditCard from '../../components/layout/ui/CreditCard';
import { useUserCards } from '../../hooks/useUserCards';
import CardFormModal from './CardFormModal';
import { CartaoType } from '../../types';

const THEME_COLOR = '#252d5f';

const MeusCartoes: React.FC = () => {
    const {
        cartoes,
        loading,
        updating,
        error,
        refreshCards,
        setDefaultCard,
        deleteCard: removeCard,
        addCard,
        updateCard,
    } = useUserCards();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CartaoType | null>(null);

    const handleOpenAddModal = () => setOpenAddModal(true);
    const handleCloseAddModal = () => setOpenAddModal(false);

    const handleOpenEditModal = (card: CartaoType) => {
        setSelectedCard(card);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedCard(null);
    };

    const handleOpenDeleteDialog = (card: CartaoType) => {
        setSelectedCard(card);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedCard(null);
    };

    const handleAddCard = async (cardData: Partial<CartaoType>) => {
        await addCard(cardData);
    };

    const handleUpdateCard = async (cardData: Partial<CartaoType>) => {
        if (selectedCard) {
            await updateCard(selectedCard.id, cardData);
        }
    };

    const handleDeleteCard = async () => {
        if (selectedCard) {
            await removeCard(selectedCard.id);
            handleCloseDeleteDialog();
        }
    };

    const handleSetDefaultCard = async (cardId: number) => {
        await setDefaultCard(cardId);
    };

    if (loading) {
        return (
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Skeleton variant="text" width={150} height={32} />
                    <Skeleton variant="rounded" width={150} height={40} />
                </Box>
                <Grid container spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
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
                    Meus Cartões
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenAddModal}
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
                    Adicionar Cartão
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid #e8e8e8',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 3 }}>
                    {cartoes.length > 0 ? (
                        <Grid container spacing={2}>
                            {cartoes.map((cartao) => (
                                <Grid item xs={12} sm={6} md={4} key={cartao.id}>
                                    <CreditCard
                                        card={cartao}
                                        onEdit={() => handleOpenEditModal(cartao)}
                                        onDelete={() => handleOpenDeleteDialog(cartao)}
                                        onSetDefault={() => handleSetDefaultCard(cartao.id)}
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
                                <CreditCardOutlined sx={{ fontSize: 36, color: '#999' }} />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{ color: '#666', mb: 2, textAlign: 'center' }}
                            >
                                Você ainda não possui cartões cadastrados.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={handleOpenAddModal}
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
                                Adicionar Cartão
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>

            <CardFormModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onSubmit={handleAddCard}
                isLoading={updating}
                title="Adicionar Cartão"
            />

            <CardFormModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateCard}
                initialData={selectedCard || undefined}
                isLoading={updating}
                title="Editar Cartão"
            />

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: { borderRadius: 2 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir este cartão?
                        {selectedCard?.is_default && (
                            <Box component="span" fontWeight="bold" display="block" mt={1}>
                                Este é seu cartão principal. Ao excluí-lo, você precisará definir
                                outro cartão como principal.
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        disabled={updating}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteCard}
                        color="error"
                        variant="contained"
                        disabled={updating}
                        sx={{
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' },
                        }}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MeusCartoes;
