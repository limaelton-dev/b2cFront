import React, { useState } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CreditCard from '../../components/ui/CreditCard';
// import CardFormModal from './CardFormModal';
import { Card } from '../../../types/card';
import { useUser } from '../../../hooks/useUser';
import LoadingState from '../../components/ui/LoadingState';

const MeusCartoes: React.FC = () => {
  const { user, loading, error } = useUser({ includeDetails: true });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Funções "stub" para editar e excluir (apenas log no console)
  const handleEdit = (card: Card) => {
    console.log("Ação de editar acionada para o cartão:", card.id);
  };

  const handleDelete = (card: Card) => {
    console.log("Ação de excluir acionada para o cartão:", card.id);
  };

  const handleSetDefault = (cardId: number) => {
    console.log("Ação de definir como padrão para o cartão:", cardId);
  };

  // Stub para adicionar um cartão
  const handleAddCard = async (cardData: Partial<Card>) => {
    console.log("Ação de adicionar cartão com dados:", cardData);
    setOpenAddModal(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const cartoes: Card[] = user?.card || [];

  return (
    <LoadingState loading={loading} error={error}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Meus Cartões</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Adicionar Cartão
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

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
              startIcon={<AddIcon />}
              onClick={() => setOpenAddModal(true)}
            >
              Adicionar Cartão
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {cartoes.map((cartao) => (
              <Grid item xs={12} sm={6} md={4} key={cartao.id}>
                <CreditCard
                  card={cartao}
                  onEdit={() => handleEdit(cartao)}
                  onDelete={() => handleDelete(cartao)}
                  onSetDefault={() => handleSetDefault(cartao.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* <CardFormModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddCard}
        isLoading={false}
        title="Adicionar Cartão"
      /> */}
    </LoadingState>
  );
};

export default MeusCartoes;
