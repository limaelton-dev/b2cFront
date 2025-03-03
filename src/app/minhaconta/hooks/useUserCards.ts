import { useState, useEffect, useCallback } from 'react';
import { 
  getUserCards, 
  setCardAsDefault, 
  deleteCard, 
  addCard, 
  updateCard 
} from '../services/userAccount';
import { CartaoType } from '../types';
import { useNotificationContext } from '../context/NotificationContext';

export const useUserCards = () => {
  const [cartoes, setCartoes] = useState<CartaoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useNotificationContext();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cardsData = await getUserCards();
      setCartoes(cardsData);
    } catch (err: any) {
      console.error('Erro ao carregar cartões:', err);
      setError('Não foi possível carregar seus cartões. Tente novamente mais tarde.');
      showError('Não foi possível carregar seus cartões.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleSetDefault = async (cardId: number) => {
    try {
      setUpdating(true);
      await setCardAsDefault(cardId);
      
      // Atualizar o estado local
      setCartoes(prev => prev.map(cartao => ({
        ...cartao,
        is_default: cartao.id === cardId
      })));
      
      showSuccess('Cartão definido como principal com sucesso!');
    } catch (err: any) {
      console.error('Erro ao definir cartão como principal:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para definir este cartão como principal.');
        } else if (errorData.statusCode === 404) {
          showError('Cartão não encontrado. Ele pode ter sido removido.');
          // Recarregar a lista de cartões para sincronizar com o servidor
          fetchCards();
        } else {
          showError('Não foi possível definir o cartão como principal. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível definir o cartão como principal. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (cardId: number) => {
    try {
      setUpdating(true);
      await deleteCard(cardId);
      
      // Remover o cartão do estado local
      setCartoes(prev => prev.filter(cartao => cartao.id !== cardId));
      
      showSuccess('Cartão excluído com sucesso!');
    } catch (err: any) {
      console.error('Erro ao excluir cartão:', err);
      
      // Tratamento específico para erros comuns
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.statusCode === 401) {
          showError('Sessão expirada. Por favor, faça login novamente.');
        } else if (errorData.statusCode === 403) {
          showError('Você não tem permissão para excluir este cartão.');
        } else if (errorData.statusCode === 404) {
          showError('Cartão não encontrado. Ele pode ter sido removido.');
          // Recarregar a lista de cartões para sincronizar com o servidor
          fetchCards();
        } else {
          showError('Não foi possível excluir o cartão. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível excluir o cartão. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleAddCard = async (cardData: Partial<CartaoType>) => {
    try {
      setUpdating(true);
      const newCard = await addCard(cardData);
      
      // Se o novo cartão for definido como padrão, atualizar todos os outros
      if (newCard.is_default) {
        setCartoes(prev => prev.map(cartao => ({
          ...cartao,
          is_default: false
        })));
      }
      
      // Adicionar o novo cartão ao estado local
      setCartoes(prev => [...prev, newCard]);
      
      showSuccess('Cartão adicionado com sucesso!');
      return newCard;
    } catch (err: any) {
      console.error('Erro ao adicionar cartão:', err);
      
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
          showError('Você não tem permissão para adicionar cartões.');
        } else {
          showError('Não foi possível adicionar o cartão. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível adicionar o cartão. Verifique sua conexão e tente novamente.');
      }
      
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateCard = async (cardId: number, cardData: Partial<CartaoType>) => {
    try {
      setUpdating(true);
      const updatedCard = await updateCard(cardId, cardData);
      
      // Atualizar o estado local
      setCartoes(prev => {
        // Se o cartão atualizado for definido como padrão, atualizar todos os outros
        if (updatedCard.is_default) {
          return prev.map(cartao => ({
            ...cartao,
            is_default: cartao.id === cardId
          }));
        }
        
        // Caso contrário, apenas atualizar o cartão específico
        return prev.map(cartao => 
          cartao.id === cardId ? updatedCard : cartao
        );
      });
      
      showSuccess('Cartão atualizado com sucesso!');
      return updatedCard;
    } catch (err: any) {
      console.error('Erro ao atualizar cartão:', err);
      
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
          showError('Você não tem permissão para atualizar este cartão.');
        } else if (errorData.statusCode === 404) {
          showError('Cartão não encontrado. Ele pode ter sido removido.');
        } else {
          showError('Não foi possível atualizar o cartão. Tente novamente mais tarde.');
        }
      } else {
        showError('Não foi possível atualizar o cartão. Verifique sua conexão e tente novamente.');
      }
      
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cartoes,
    loading,
    updating,
    error,
    refreshCards: fetchCards,
    setDefaultCard: handleSetDefault,
    deleteCard: handleDelete,
    addCard: handleAddCard,
    updateCard: handleUpdateCard
  };
};

export default useUserCards; 