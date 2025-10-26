"use client";
import { useState } from 'react';
import { valorFrete, valorFreteDeslogado } from '../../api/checkout/services/checkout';

/**
 * Hook para calcular frete no checkout
 */
export const useShippingCalculation = () => {
    const [isLoadingShipping, setIsLoadingShipping] = useState(false);
    const [shippingName, setShippingName] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState(0);
    const [shippingError, setShippingError] = useState('');

    /**
     * Calcula o frete com base no CEP e status de autenticação
     * @param zipCode CEP para cálculo do frete
     * @param isAuthenticated Status de autenticação do usuário
     * @param cartData Dados do carrinho
     */
    const calculateShipping = async (zipCode: string, isAuthenticated: boolean, cartData: any[]) => {
        if (!zipCode || zipCode.length !== 9) {
            setShippingError('CEP inválido');
            return null;
        }

        setIsLoadingShipping(true);
        setShippingError('');

        try {
            let response;

            // Determinar qual função usar com base no status de autenticação
            if (isAuthenticated) {
                response = await valorFrete(zipCode);
            } else {
                
                // Formatar os dados dos produtos para o serviço
                const formattedProducts = cartData.map(item => ({
                    id: item.id || item.productId || item.produto_id,
                    produto_id: item.produto_id || item.id || item.productId,
                    quantity: item.qty || item.quantity || 1
                }));
                
                response = await valorFreteDeslogado(zipCode, formattedProducts);
            }


            // Processar resposta da API
            if (response?.data && response.data.success) {
                const { data: shippingData } = response.data;
                
                // Verificar se existem serviços disponíveis
                if (shippingData.availableServices && shippingData.availableServices.length > 0) {
                    const firstService = shippingData.availableServices[0];
                    setShippingName(firstService.serviceName);
                    setShippingPrice(firstService.price);
                    setDeliveryTime(firstService.deliveryTime);
                    setShippingError('');
                    return {
                        success: true,
                        name: firstService.serviceName,
                        price: firstService.price,
                        deliveryTime: firstService.deliveryTime
                    };
                } else {
                    setShippingError('Não há serviços de entrega disponíveis para este CEP');
                    setShippingName('');
                    setShippingPrice(0);
                    setDeliveryTime(0);
                    return {
                        success: false,
                        error: 'Não há serviços de entrega disponíveis para este CEP'
                    };
                }
            } else {
                const errorMessage = response?.data?.message || 'Erro ao calcular o frete';
                setShippingError(errorMessage);
                setShippingName('');
                setShippingPrice(0);
                setDeliveryTime(0);
                return {
                    success: false,
                    error: errorMessage
                };
            }
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            setShippingError('Erro ao calcular o frete. Tente novamente.');
            setShippingName('');
            setShippingPrice(0);
            setDeliveryTime(0);
            return {
                success: false,
                error: 'Erro ao calcular o frete. Tente novamente.'
            };
        } finally {
            setIsLoadingShipping(false);
        }
    };

    return {
        calculateShipping,
        isLoadingShipping,
        shippingName,
        shippingPrice,
        deliveryTime,
        shippingError
    };
}; 