import { useState, useEffect, useCallback } from 'react';
import { getUserCards, setCardAsDefault, deleteCard } from '../services/userAccount';
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
    } catch (err) {
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
    } catch (err) {
      console.error('Erro ao definir cartão como principal:', err);
      showError('Não foi possível definir o cartão como principal.');
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
    } catch (err) {
      console.error('Erro ao excluir cartão:', err);
      showError('Não foi possível excluir o cartão.');
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
    deleteCard: handleDelete
  };
};

export default useUserCards; 