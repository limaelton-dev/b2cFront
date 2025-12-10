import { useEffect, useState, useCallback } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import { useToastSide } from '@/context/ToastSideProvider';
import { 
    getUserAddresses, 
    setAddressAsDefault, 
    deleteAddress, 
    addAddress, 
    updateAddress,
    checkAddressLinkedToOrders
} from '../services/userAccount';
import { EnderecoType } from '../types';

export function useUserAddresses() {
    const { showToast } = useToastSide();
    const [linkedAddresses, setLinkedAddresses] = useState<number[]>([]);

    const crud = useCrudOperations<EnderecoType>({
        fetchFn: getUserAddresses,
        addFn: addAddress,
        updateFn: updateAddress,
        deleteFn: deleteAddress,
        setDefaultFn: setAddressAsDefault,
        onSuccess: (message) => showToast(message, 'success'),
        onError: (message) => showToast(message, 'error'),
        entityName: 'endereço',
        hasDefault: true
    });

    const checkLinkedAddresses = useCallback(async (addresses: EnderecoType[]) => {
        const linkedIds: number[] = [];
        for (const address of addresses) {
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
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await crud.fetchItems();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (crud.items.length > 0) {
            checkLinkedAddresses(crud.items);
        }
    }, [crud.items, checkLinkedAddresses]);

    return {
        enderecos: crud.items,
        loading: crud.loading,
        updating: crud.updating,
        error: crud.error,
        linkedAddresses,
        refreshAddresses: crud.fetchItems,
        setDefaultAddress: crud.setDefaultItem!,
        deleteAddress: crud.deleteItem,
        addAddress: crud.addItem,
        updateAddress: crud.updateItem
    };
}

