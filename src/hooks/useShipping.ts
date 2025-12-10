import { useState, useCallback } from 'react';
import { fetchAddressByPostalCode, AddressData } from '@/api/address/services/cep';
import { calculateShippingForAuthenticatedUser, calculateShippingForGuest, ShippingProduct } from '@/api/shipping';

export interface ShippingInfo {
    serviceName: string;
    price: number;
    deliveryTime: number;
}

export function useShipping() {
    const [postalCode, setPostalCode] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
    const [addressData, setAddressData] = useState<AddressData | null>(null);
    const [error, setError] = useState('');

    const lookupAddressByPostalCode = useCallback(async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        
        if (cleanCep.length !== 8) {
            setError('CEP inválido');
            return null;
        }

        setLoadingCep(true);
        setError('');

        try {
            const address = await fetchAddressByPostalCode(cep);
            setAddressData(address);
            return address;
        } catch (err) {
            console.error('Erro ao buscar CEP:', err);
            setError('CEP não encontrado');
            return null;
        } finally {
            setLoadingCep(false);
        }
    }, []);

    const calculateShipping = useCallback(
        async (cep: string, products: ShippingProduct[], isAuthenticated: boolean) => {
            const cleanCep = cep.replace(/\D/g, '');

            if (cleanCep.length !== 8) {
                setError('CEP inválido');
                return null;
            }

            setLoadingShipping(true);
            setError('');

            try {
                const response = isAuthenticated
                    ? await calculateShippingForAuthenticatedUser(cep)
                    : await calculateShippingForGuest(cep, products);

                if (response?.success && response.data?.availableServices?.length) {
                    const service = response.data.availableServices[0];
                    setShippingInfo({
                        serviceName: service.serviceName,
                        price: service.price,
                        deliveryTime: service.deliveryTime
                    });
                    return service;
                } else if (response?.data?.totalPreco !== undefined) {
                    const service = {
                        serviceName: 'PAC',
                        price: response.data.totalPreco,
                        deliveryTime: response.data.maiorPrazo || 0
                    };
                    setShippingInfo(service);
                    return service;
                } else {
                    setError('Não foi possível calcular o frete');
                    setShippingInfo(null);
                    return null;
                }
            } catch (err) {
                console.error('Erro ao calcular frete:', err);
                setError('Erro ao calcular frete');
                setShippingInfo(null);
                return null;
            } finally {
                setLoadingShipping(false);
            }
        },
        []
    );

    const clearShipping = useCallback(() => {
        setShippingInfo(null);
        setError('');
    }, []);

    const clearAll = useCallback(() => {
        setPostalCode('');
        setShippingInfo(null);
        setAddressData(null);
        setError('');
    }, []);

    return {
        postalCode,
        setPostalCode,
        loadingCep,
        loadingShipping,
        shippingInfo,
        addressData,
        error,
        lookupAddressByPostalCode,
        calculateShipping,
        clearShipping,
        clearAll
    };
}

