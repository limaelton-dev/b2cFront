import { useState, useCallback } from 'react';

export interface CrudOperations<T> {
    items: T[];
    loading: boolean;
    updating: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
    addItem: (item: Partial<T>) => Promise<T | undefined>;
    updateItem: (id: number, item: Partial<T>) => Promise<T | undefined>;
    deleteItem: (id: number) => Promise<void>;
    setDefaultItem?: (id: number) => Promise<void>;
}

interface CrudConfig<T> {
    fetchFn: () => Promise<T[]>;
    addFn: (item: Partial<T>) => Promise<T>;
    updateFn: (id: number, item: Partial<T>) => Promise<T>;
    deleteFn: (id: number) => Promise<void>;
    setDefaultFn?: (id: number) => Promise<void>;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    entityName: string;
    hasDefault?: boolean;
}

export function useCrudOperations<T extends { id: number; is_default?: boolean }>(
    config: CrudConfig<T>
): CrudOperations<T> {
    const {
        fetchFn,
        addFn,
        updateFn,
        deleteFn,
        setDefaultFn,
        onSuccess,
        onError,
        entityName,
        hasDefault = false
    } = config;

    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((err: any, operation: string) => {
        console.error(`Erro ao ${operation} ${entityName}:`, err);

        if (err.response?.data) {
            const errorData = err.response.data;
            const statusCode = errorData.statusCode;

            const errorMessages: Record<number, string> = {
                400: `Dados inválidos. Verifique as informações e tente novamente.`,
                401: `Sessão expirada. Por favor, faça login novamente.`,
                403: `Você não tem permissão para ${operation} ${entityName}.`,
                404: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} não encontrado.`,
                409: errorData.message || `Conflito ao ${operation} ${entityName}.`
            };

            const message = errorMessages[statusCode] || `Não foi possível ${operation} ${entityName}.`;
            onError?.(message);
            setError(message);
        } else {
            const message = `Não foi possível ${operation} ${entityName}. Verifique sua conexão.`;
            onError?.(message);
            setError(message);
        }
    }, [entityName, onError]);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchFn();
            setItems(data);
        } catch (err) {
            handleError(err, 'carregar');
        } finally {
            setLoading(false);
        }
    }, [fetchFn, handleError]);

    const addItem = useCallback(async (itemData: Partial<T>): Promise<T | undefined> => {
        try {
            setUpdating(true);
            const newItem = await addFn(itemData);

            if (hasDefault && newItem.is_default) {
                setItems(prev => prev.map(item => ({ ...item, is_default: false })));
            }

            setItems(prev => [...prev, newItem]);
            onSuccess?.(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} adicionado com sucesso!`);
            return newItem;
        } catch (err) {
            handleError(err, 'adicionar');
            throw err;
        } finally {
            setUpdating(false);
        }
    }, [addFn, hasDefault, entityName, onSuccess, handleError]);

    const updateItem = useCallback(async (id: number, itemData: Partial<T>): Promise<T | undefined> => {
        try {
            setUpdating(true);
            const updatedItem = await updateFn(id, itemData);

            setItems(prev => {
                if (hasDefault && updatedItem.is_default) {
                    return prev.map(item => ({
                        ...item,
                        is_default: item.id === id
                    }));
                }
                return prev.map(item => (item.id === id ? updatedItem : item));
            });

            onSuccess?.(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} atualizado com sucesso!`);
            return updatedItem;
        } catch (err) {
            handleError(err, 'atualizar');
            throw err;
        } finally {
            setUpdating(false);
        }
    }, [updateFn, hasDefault, entityName, onSuccess, handleError]);

    const deleteItem = useCallback(async (id: number): Promise<void> => {
        try {
            setUpdating(true);
            await deleteFn(id);
            setItems(prev => prev.filter(item => item.id !== id));
            onSuccess?.(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} excluído com sucesso!`);
        } catch (err) {
            handleError(err, 'excluir');
            if (err.response?.data?.statusCode === 404) {
                await fetchItems();
            }
            throw err;
        } finally {
            setUpdating(false);
        }
    }, [deleteFn, entityName, onSuccess, handleError, fetchItems]);

    const setDefaultItem = setDefaultFn ? useCallback(async (id: number): Promise<void> => {
        try {
            setUpdating(true);
            await setDefaultFn(id);
            setItems(prev => prev.map(item => ({ ...item, is_default: item.id === id })));
            onSuccess?.(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} definido como principal!`);
        } catch (err) {
            handleError(err, 'definir como principal');
            if (err.response?.data?.statusCode === 404) {
                await fetchItems();
            }
        } finally {
            setUpdating(false);
        }
    }, [setDefaultFn, entityName, onSuccess, handleError, fetchItems]) : undefined;

    return {
        items,
        loading,
        updating,
        error,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        setDefaultItem
    };
}

