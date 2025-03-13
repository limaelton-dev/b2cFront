import React, { useState } from 'react';
import { Box, Typography, Grid, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressCard from '../../components/ui/AddressCard';
// import AddressFormModal from './AddressFormModal';
import { Address } from '../../../types/address';
import { useUser } from '../../../hooks/useUser';
import LoadingState from '../../components/ui/LoadingState';

const MeusEnderecos: React.FC = () => {
  const { user, loading, error } = useUser({ includeDetails: true });
  const [openFormModal, setOpenFormModal] = useState(false);

  // Funções "stub" para editar e excluir
  const handleEdit = (address: Address) => {
    console.log("Ação de editar acionada para o endereço:", address.id);
  };

  const handleDelete = (address: Address) => {
    console.log("Ação de excluir acionada para o endereço:", address.id);
  };

  const handleSetDefault = (id: number) => {
    console.log("Ação de definir endereço padrão para o endereço:", id);
  };

  // Stub para salvar (adicionar/atualizar) um endereço
  const handleSaveAddress = async (addressData: Partial<Address>) => {
    console.log("Ação de salvar endereço com dados:", addressData);
    setOpenFormModal(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const enderecos: Address[] = user?.address || [];

  return (
    <LoadingState loading={loading} error={error}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Meus Endereços</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenFormModal(true)}
          >
            Novo Endereço
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {enderecos.length === 0 ? (
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
              Você ainda não possui endereços cadastrados.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenFormModal(true)}
            >
              Adicionar Endereço
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {enderecos.map((endereco) => (
              <Grid item xs={12} md={6} key={endereco.id}>
                <AddressCard 
                  endereco={endereco}
                  onEdit={() => handleEdit(endereco)}
                  onDelete={() => handleDelete(endereco)}
                  onSetDefault={!endereco.is_default ? () => handleSetDefault(endereco.id) : undefined}
                  linkedToOrders={false}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* <AddressFormModal 
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        address={null}
        onSave={handleSaveAddress}
        loading={false}
      /> */}
    </LoadingState>
  );
};

export default MeusEnderecos;
