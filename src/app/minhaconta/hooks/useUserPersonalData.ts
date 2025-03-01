import { useState, useEffect, useCallback } from 'react';
import { getUserPersonalData, updateUserPersonalData } from '../services/userAccount';
import { DadosPessoaisType } from '../types';
import { useNotificationContext } from '../context/NotificationContext';

export const useUserPersonalData = () => {
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisType>({
    nome: '',
    cpf: '',
    email: '',
    username: '',
    dob: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useNotificationContext();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await getUserPersonalData();
      setDadosPessoais(userData);
    } catch (err) {
      console.error('Erro ao carregar dados pessoais:', err);
      setError('Não foi possível carregar seus dados pessoais. Tente novamente mais tarde.');
      showError('Não foi possível carregar seus dados pessoais.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateField = async (field: keyof DadosPessoaisType, value: string) => {
    try {
      setUpdating(true);
      await updateUserPersonalData(field, value);
      
      // Atualizar o estado local com o novo valor
      setDadosPessoais(prev => ({
        ...prev,
        [field]: value
      }));
      
      showSuccess(`${getFieldLabel(field)} atualizado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao atualizar ${field}:`, err);
      showError(`Não foi possível atualizar ${getFieldLabel(field).toLowerCase()}.`);
    } finally {
      setUpdating(false);
    }
  };

  // Função auxiliar para obter o rótulo do campo
  const getFieldLabel = (field: keyof DadosPessoaisType): string => {
    const labels: Record<keyof DadosPessoaisType, string> = {
      nome: 'Nome',
      cpf: 'CPF',
      email: 'E-mail',
      username: 'Nome de usuário',
      dob: 'Data de nascimento',
      phone: 'Telefone'
    };
    return labels[field];
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    dadosPessoais,
    loading,
    updating,
    error,
    refreshData: fetchUserData,
    updateField
  };
};

export default useUserPersonalData; 