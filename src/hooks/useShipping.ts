import { useState, useCallback } from 'react';
import { fetchAddressByCep, CepAddress } from '@/api/address/services/cep';
import { 
    calculateShippingForCart, 
    calculateShippingForProduct, 
    ShippingCartItem,
    ShippingService 
} from '@/api/shipping';

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
    const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
    const [addressData, setAddressData] = useState<CepAddress | null>(null);
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
            const address = await fetchAddressByCep(cep);
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

    const calculateShippingForCartItems = useCallback(
        async (cep: string, items: ShippingCartItem[]) => {
            const cleanCep = cep.replace(/\D/g, '');

            if (cleanCep.length !== 8) {
                setError('CEP inválido');
                return null;
            }

            if (!items.length) {
                setError('Nenhum item para calcular frete');
                return null;
            }

            setLoadingShipping(true);
            setError('');

            try {
                const response = await calculateShippingForCart(cleanCep, items);

                if (response?.success && response.services?.length) {
                    setShippingServices(response.services);
                    const service = response.services[0];
                    const info: ShippingInfo = {
                        serviceName: service.serviceName,
                        price: service.price,
                        deliveryTime: service.deliveryDays
                    };
                    setShippingInfo(info);
                    return info;
                }
                
                setError(response?.message || 'Não foi possível calcular o frete');
                setShippingInfo(null);
                setShippingServices([]);
                return null;
            } catch (err) {
                console.error('Erro ao calcular frete:', err);
                setError('Erro ao calcular frete');
                setShippingInfo(null);
                setShippingServices([]);
                return null;
            } finally {
                setLoadingShipping(false);
            }
        },
        []
    );

    const calculateShippingForSingleProduct = useCallback(
        async (cep: string, skuId: number, partnerId?: string) => {
            const cleanCep = cep.replace(/\D/g, '');

            if (cleanCep.length !== 8) {
                setError('CEP inválido');
                return null;
            }

            setLoadingShipping(true);
            setError('');

            try {
                const response = await calculateShippingForProduct(skuId, cleanCep, partnerId);

                if (response?.success && response.services?.length) {
                    setShippingServices(response.services);
                    const service = response.services[0];
                    const info: ShippingInfo = {
                        serviceName: service.serviceName,
                        price: service.price,
                        deliveryTime: service.deliveryDays
                    };
                    setShippingInfo(info);
                    return info;
                }
                
                setError(response?.message || 'Não foi possível calcular o frete');
                setShippingInfo(null);
                setShippingServices([]);
                return null;
            } catch (err) {
                console.error('Erro ao calcular frete:', err);
                setError('Erro ao calcular frete');
                setShippingInfo(null);
                setShippingServices([]);
                return null;
            } finally {
                setLoadingShipping(false);
            }
        },
        []
    );

    const clearShipping = useCallback(() => {
        setShippingInfo(null);
        setShippingServices([]);
        setError('');
    }, []);

    const clearAll = useCallback(() => {
        setPostalCode('');
        setShippingInfo(null);
        setShippingServices([]);
        setAddressData(null);
        setError('');
    }, []);

    return {
        postalCode,
        setPostalCode,
        loadingCep,
        loadingShipping,
        shippingInfo,
        shippingServices,
        addressData,
        error,
        lookupAddressByPostalCode,
        calculateShippingForCartItems,
        calculateShippingForSingleProduct,
        clearShipping,
        clearAll
    };
}
