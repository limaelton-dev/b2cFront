import { useState, useEffect, useCallback } from 'react';
import { 
  getUserPersonalData, 
  updateUserPersonalData, 
  updateProfile, 
  updateUser 
} from '../services/userAccount';
import { DadosPessoaisType } from '../types';
import { useNotificationContext } from '../context/NotificationContext';

export const useUserPersonalData = () => {
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisType>({
    full_name: '',
    cpf: '',
    email: '',
    username: '',
    birth_date: '',
    phone: '',
    gender: null,
    profile_type: 'PF',
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

  /**
   * Atualiza múltiplos campos do perfil ou do usuário
   * @param data Dados a serem atualizados
   * @param type Tipo de atualização ('profile' ou 'user')
   */
  const updateData = async (data: Partial<DadosPessoaisType>, type: 'profile' | 'user') => {
    try {
      setUpdating(true);
      
      if (type === 'profile') {
        await updateProfile(data);
        showSuccess('Dados pessoais atualizados com sucesso!');
      } else {
        await updateUser(data);
        showSuccess('Dados de usuário atualizados com sucesso!');
      }
      
      // Atualizar o estado local com os novos valores
      setDadosPessoais(prev => ({
        ...prev,
        ...data
      }));
      
      // Recarregar os dados para garantir consistência
      await fetchUserData();
      
    } catch (err) {
      console.error(`Erro ao atualizar dados de ${type}:`, err);
      showError(`Não foi possível atualizar seus dados. Tente novamente mais tarde.`);
    } finally {
      setUpdating(false);
    }
  };

  // Função auxiliar para obter o rótulo do campo
  const getFieldLabel = (field: keyof DadosPessoaisType): string => {
    const labels: Record<string, string> = {
      full_name: 'Nome',
      cpf: 'CPF',
      email: 'E-mail',
      username: 'Nome de usuário',
      birth_date: 'Data de nascimento',
      phone: 'Telefone',
      gender: 'Gênero',
      profile_type: 'Tipo de perfil'
    };
    return labels[field] || field;
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
    updateField,
    updateData
  };
};

export default useUserPersonalData; 