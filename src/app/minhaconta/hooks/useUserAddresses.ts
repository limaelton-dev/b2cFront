import { useState, useEffect, useCallback } from 'react';
import { 
  getUserAddresses, 
  setAddressAsDefault, 
  deleteAddress, 
  addAddress, 
  updateAddress,
  checkAddressLinkedToOrders
} from '../services/userAccount';
import { EnderecoType } from '../types';
import { useNotificationContext } from '../context/NotificationContext';

export const useUserAddresses = () => {
  const [enderecos, setEnderecos] = useState<EnderecoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedAddresses, setLinkedAddresses] = useState<number[]>([]);
  const { showError, showSuccess } = useNotificationContext();

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const addressesData = await getUserAddresses();
      setEnderecos(addressesData);
      
      // Verificar quais endereços estão vinculados a pedidos
      const linkedIds: number[] = [];
      for (const address of addressesData) {
        try {
          const isLinked = await checkAddressLinkedToOrders(address.id);
          if (isLinked) {
            linkedIds.push(address.id);
          }
        } catch (err) {
          console.error(`Erro ao verificar vínculo do endereço ${address.id}:`, err);
        }
      }
      
      setLinkedAddresses(linkedIds);
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
    } catch (err: any) {
      console.error('Erro ao definir endereço como principal:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para definir este endereço como principal.');
        } else if (errorData.statusCode === 404) {
          showError('Endereço não encontrado. Ele pode ter sido removido.');
          // Recarregar a lista de endereços para sincronizar com o servidor
          fetchAddresses();
        } else {
          showError('Não foi possível definir o endereço como principal. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível definir o endereço como principal. Verifique sua conexão e tente novamente.');
      }
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
    } catch (err: any) {
      console.error('Erro ao excluir endereço:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para excluir este endereço.');
        } else if (errorData.statusCode === 404) {
          showError('Endereço não encontrado. Ele pode ter sido removido.');
          // Recarregar a lista de endereços para sincronizar com o servidor
          fetchAddresses();
        } else if (errorData.statusCode === 409) {
          // Caso específico: endereço vinculado a pedidos
          showError(errorData.message || 'Este endereço não pode ser excluído porque está sendo usado em pedidos. Adicione um novo endereço e defina como padrão.');
        } else {
          showError('Não foi possível excluir o endereço. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível excluir o endereço. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = async (addressData: Partial<EnderecoType>) => {
    try {
      setUpdating(true);
      const newAddress = await addAddress(addressData);
      
      // Se o novo endereço for definido como padrão, atualizar todos os outros
      if (newAddress.is_default) {
        setEnderecos(prev => prev.map(endereco => ({
          ...endereco,
          is_default: false
        })));
      }
      
      // Adicionar o novo endereço ao estado local
      setEnderecos(prev => [...prev, newAddress]);
      
      showSuccess('Endereço adicionado com sucesso!');
      return newAddress;
    } catch (err: any) {
      console.error('Erro ao adicionar endereço:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 400) {
          // Erro de validação
          if (errorData.message && Array.isArray(errorData.message)) {
            // Mostrar o primeiro erro da lista
            showError(`Erro de validação: ${errorData.message[0]}`);
          } else if (typeof errorData.message === 'string') {
            showError(`Erro de validação: ${errorData.message}`);
          } else {
            showError('Dados inválidos. Verifique as informações e tente novamente.');
          }
        } else if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para adicionar endereços.');
        } else {
          showError('Não foi possível adicionar o endereço. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível adicionar o endereço. Verifique sua conexão e tente novamente.');
      }
      
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAddress = async (addressId: number, addressData: Partial<EnderecoType>) => {
    try {
      setUpdating(true);
      const updatedAddress = await updateAddress(addressId, addressData);
      
      // Atualizar o estado local
      setEnderecos(prev => {
        // Se o endereço atualizado for definido como padrão, atualizar todos os outros
        if (updatedAddress.is_default) {
          return prev.map(endereco => ({
            ...endereco,
            is_default: endereco.id === addressId
          }));
        }
        
        // Caso contrário, apenas atualizar o endereço específico
        return prev.map(endereco => 
          endereco.id === addressId ? updatedAddress : endereco
        );
      });
      
      showSuccess('Endereço atualizado com sucesso!');
      return updatedAddress;
    } catch (err: any) {
      console.error('Erro ao atualizar endereço:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 400) {
          // Erro de validação
          if (errorData.message && Array.isArray(errorData.message)) {
            // Mostrar o primeiro erro da lista
            showError(`Erro de validação: ${errorData.message[0]}`);
          } else if (typeof errorData.message === 'string') {
            showError(`Erro de validação: ${errorData.message}`);
          } else {
            showError('Dados inválidos. Verifique as informações e tente novamente.');
          }
        } else if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para atualizar este endereço.');
        } else if (errorData.statusCode === 404) {
          showError('Endereço não encontrado. Ele pode ter sido removido.');
        } else {
          showError('Não foi possível atualizar o endereço. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível atualizar o endereço. Verifique sua conexão e tente novamente.');
      }
      
      throw err;
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
    linkedAddresses,
    refreshAddresses: fetchAddresses,
    setDefaultAddress: handleSetDefault,
    deleteAddress: handleDelete,
    addAddress: handleAddAddress,
    updateAddress: handleUpdateAddress
  };
};

export default useUserAddresses; 