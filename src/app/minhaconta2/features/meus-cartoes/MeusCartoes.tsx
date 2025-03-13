import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CreditCard from '../../components/ui/CreditCard';
import useUserCards from '../../hooks/useUserCards';
import CardFormModal from './CardFormModal';
import { CartaoType } from '../../types';

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
    updateCard
  } = useUserCards();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CartaoType | null>(null);

  // Manipuladores para o modal de adicionar cartão
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Manipuladores para o modal de editar cartão
  const handleOpenEditModal = (card: CartaoType) => {
    setSelectedCard(card);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCard(null);
  };

  // Manipuladores para o diálogo de confirmação de exclusão
  const handleOpenDeleteDialog = (card: CartaoType) => {
    setSelectedCard(card);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCard(null);
  };

  // Funções para manipular cartões
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Meus Cartões
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          disabled={updating}
        >
          Adicionar Cartão
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cartoes.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          border="1px dashed #ccc"
          borderRadius={2}
          p={3}
        >
          <Typography variant="body1" color="textSecondary" mb={2}>
            Você ainda não possui cartões cadastrados.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            Adicionar Cartão
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
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
      )}

      {/* Modal para adicionar cartão */}
      <CardFormModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSubmit={handleAddCard}
        isLoading={updating}
        title="Adicionar Cartão"
      />

      {/* Modal para editar cartão */}
      <CardFormModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateCard}
        initialData={selectedCard || undefined}
        isLoading={updating}
        title="Editar Cartão"
      />

      {/* Diálogo de confirmação para excluir cartão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este cartão?
            {selectedCard?.is_default && (
              <Box component="span" fontWeight="bold" display="block" mt={1}>
                Este é seu cartão principal. Ao excluí-lo, você precisará definir outro cartão como principal.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={updating}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteCard} 
            color="error" 
            variant="contained"
            disabled={updating}
          >
            {updating ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeusCartoes; 