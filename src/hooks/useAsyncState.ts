import { useState, useCallback } from 'react';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useAsyncState<T>(initialData: T | null = null) {
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <R = T>(
        asyncFn: () => Promise<R>,
        options?: {
            onSuccess?: (result: R) => void;
            onError?: (error: any) => void;
            transform?: (result: R) => T;
        }
    ): Promise<R | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await asyncFn();
            
            if (options?.transform) {
                setData(options.transform(result));
            } else {
                setData(result as unknown as T);
            }

            options?.onSuccess?.(result);
            return result;
        } catch (err: any) {
            const errorMessage = err?.message || 'Ocorreu um erro';
            setError(errorMessage);
            options?.onError?.(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setLoading(false);
    }, [initialData]);

    const setDataDirectly = useCallback((newData: T | null) => {
        setData(newData);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        setData: setDataDirectly,
        setError,
        clearError
    };
}

