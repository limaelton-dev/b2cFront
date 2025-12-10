import { useEffect } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import { useToastSide } from '@/context/ToastSideProvider';
import { 
    getUserCards, 
    setCardAsDefault, 
    deleteCard, 
    addCard, 
    updateCard 
} from '../services/userAccount';
import { CartaoType } from '../types';

export function useUserCards() {
    const { showToast } = useToastSide();

    const crud = useCrudOperations<CartaoType>({
        fetchFn: getUserCards,
        addFn: addCard,
        updateFn: updateCard,
        deleteFn: deleteCard,
        setDefaultFn: setCardAsDefault,
        onSuccess: (message) => showToast(message, 'success'),
        onError: (message) => showToast(message, 'error'),
        entityName: 'cartão',
        hasDefault: true
    });

    useEffect(() => {
        crud.fetchItems();
    }, []);

    return {
        cartoes: crud.items,
        loading: crud.loading,
        updating: crud.updating,
        error: crud.error,
        refreshCards: crud.fetchItems,
        setDefaultCard: crud.setDefaultItem!,
        deleteCard: crud.deleteItem,
        addCard: crud.addItem,
        updateCard: crud.updateItem
    };
}

