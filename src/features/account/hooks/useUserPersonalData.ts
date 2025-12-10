import { useState, useEffect, useCallback } from 'react';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useToastSide } from '@/context/ToastSideProvider';
import { 
    getUserPersonalData, 
    updateProfile, 
    updateUser 
} from '../services/userAccount';
import { DadosPessoaisType } from '../types';

const initialData: DadosPessoaisType = {
    full_name: '',
    cpf: '',
    email: '',
    username: '',
    birth_date: '',
    phone: '',
    gender: null,
    profile_type: 'PF',
};

export function useUserPersonalData() {
    const { showToast } = useToastSide();
    const { data: dadosPessoais, loading, error, execute, setData } = useAsyncState<DadosPessoaisType>(initialData);
    const [updating, setUpdating] = useState(false);

    const fetchUserData = useCallback(async () => {
        await execute(getUserPersonalData, {
            onError: () => showToast('Não foi possível carregar seus dados pessoais.', 'error')
        });
    }, [execute, showToast]);

    const updateData = useCallback(async (data: Partial<DadosPessoaisType>, type: 'profile' | 'user') => {
        setUpdating(true);
        try {
            if (type === 'profile') {
                await updateProfile(data);
            } else {
                await updateUser(data);
            }

            setData({ ...dadosPessoais, ...data });
            showToast('Dados atualizados com sucesso!', 'success');
            await fetchUserData();
        } catch (err) {
            console.error(`Erro ao atualizar dados de ${type}:`, err);
            showToast('Não foi possível atualizar seus dados.', 'error');
        } finally {
            setUpdating(false);
        }
    }, [setData, showToast, fetchUserData]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return {
        dadosPessoais,
        loading,
        updating,
        error,
        refreshData: fetchUserData,
        updateData
    };
}

