import { useState, useEffect, useCallback } from 'react';
import { getUserAddresses, setAddressAsDefault, deleteAddress } from '../services/userAccount';
import { EnderecoType } from '../types';
import { useNotificationContext } from '../context/NotificationContext';

export const useUserAddresses = () => {
  const [enderecos, setEnderecos] = useState<EnderecoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useNotificationContext();

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const addressesData = await getUserAddresses();
      setEnderecos(addressesData);
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
      setError('Não foi possível carregar seus endereços. Tente novamente mais tarde.');
      showError('Não foi possível carregar seus endereços.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleSetDefault = async (addressId: number) => {
    try {
      setUpdating(true);
      await setAddressAsDefault(addressId);
      
      // Atualizar o estado local
      setEnderecos(prev => prev.map(endereco => ({
        ...endereco,
        is_default: endereco.id === addressId
      })));
      
      showSuccess('Endereço definido como principal com sucesso!');
    } catch (err) {
      console.error('Erro ao definir endereço como principal:', err);
      showError('Não foi possível definir o endereço como principal.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    try {
      setUpdating(true);
      await deleteAddress(addressId);
      
      // Remover o endereço do estado local
      setEnderecos(prev => prev.filter(endereco => endereco.id !== addressId));
      
      showSuccess('Endereço excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir endereço:', err);
      showError('Não foi possível excluir o endereço.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    enderecos,
    loading,
    updating,
    error,
    refreshAddresses: fetchAddresses,
    setDefaultAddress: handleSetDefault,
    deleteAddress: handleDelete
  };
};

export default useUserAddresses; 