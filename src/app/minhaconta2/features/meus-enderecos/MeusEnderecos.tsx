import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressCard from '../../components/ui/AddressCard';
import LoadingState from '../../components/ui/LoadingState';
import useUserAddresses from '../../hooks/useUserAddresses';
import AddressFormModal from './AddressFormModal';
import { EnderecoType } from '../../types';

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
    updateAddress
  } = useUserAddresses();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<EnderecoType | null>(null);

  const handleEdit = (id: number) => {
    const addressToEdit = enderecos.find(endereco => endereco.id === id);
    if (addressToEdit) {
      setSelectedAddress(addressToEdit);
      setIsFormModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (linkedAddresses.includes(id)) {
      // Se o endereço estiver vinculado a pedidos, mostrar mensagem e não permitir exclusão
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
    // Verificar se há alterações não salvas
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
      // Editar endereço existente
      await updateAddress(selectedAddress.id, addressData);
    } else {
      // Adicionar novo endereço
      await addAddress(addressData);
    }
  };

  return (
    <LoadingState loading={loading} error={error} onRetry={refreshAddresses}>
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
            Meus Endereços
          </Typography>
          
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
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
            Novo Endereço
          </Button>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }} />
        
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: '4px',
          p: 2.5
        }}>
          <Grid container spacing={2.5}>
            {enderecos.map((endereco) => (
              <Grid item xs={12} md={6} key={endereco.id}>
                <AddressCard 
                  endereco={endereco}
                  onEdit={() => handleEdit(endereco.id)}
                  onDelete={() => handleDelete(endereco.id)}
                  onSetDefault={!endereco.is_default ? () => handleSetDefault(endereco.id) : undefined}
                  linkedToOrders={linkedAddresses.includes(endereco.id)}
                />
              </Grid>
            ))}
          </Grid>
          
          {enderecos.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '6px',
                mt: 2
              }}
            >
              <Typography 
                variant="body1"
                sx={{ 
                  color: '#666',
                  fontSize: '0.85rem',
                  mb: 2
                }}
              >
                Você ainda não possui endereços cadastrados.
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
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
                Adicionar Endereço
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Modal de formulário de endereço */}
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