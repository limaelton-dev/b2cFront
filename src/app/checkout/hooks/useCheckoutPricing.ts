"use client";
import { useState } from 'react';
import { applyDiscounts, applyPixDiscount, formatPrice } from '../utils/pricing';
import axios from 'axios';
import { valorFrete, valorFreteDeslogado } from '../../services/checkout';

/**
 * Hook para gerenciar cálculos de preço e frete no checkout
 */
export const useCheckoutPricing = (cartItems: any[], cartData: any[]) => {
    // Estados relacionados ao frete
    const [freteNome, setFreteNome] = useState('');
    const [fretePreco, setFretePreco] = useState(0);
    const [prazo, setPrazo] = useState(0);
    
    // Desconto para pagamentos com PIX (5%)
    const [discountPix] = useState(5);
    
    /**
     * Calcula o subtotal do carrinho, aplicando descontos
     * @param couponDiscount Percentual de desconto do cupom
     * @returns String formatado com o subtotal
     */
    const calculateSubtotal = (couponDiscount?: number) => {
        // Calcular o valor base dos produtos com verificações robustas
        const baseTotal = cartItems.reduce((total, item) => {
            const index = cartData.findIndex(i => i.id === item.id || i.produto_id === item.pro_codigo);
            const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
            const price = item.pro_precovenda || 0;
            return total + (price * qty);
        }, 0);

        // Aplicar descontos
        const discountedTotal = applyDiscounts(baseTotal, couponDiscount);
        
        // Adicionar custo de entrega e formatar
        return (Number(discountedTotal.toFixed(2)) + Number(fretePreco)).toFixed(2);
    };
    
    /**
     * Calcula o valor do carrinho sem descontos
     * @returns Valor bruto calculado
     */
    const calculateRawTotal = () => {
        return cartItems.reduce((total, item) => {
            const index = cartData.findIndex(i => i.id === item.id || i.produto_id === item.pro_codigo);
            const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
            const price = item.pro_precovenda || 0;
            return total + (price * qty);
        }, 0).toFixed(2).replace('.', ',');
    };
    
    /**
     * Obtém o preço formatado com desconto PIX
     * @param couponDiscount Percentual de desconto do cupom
     * @returns String formatado com o preço com desconto PIX
     */
    const getPixDiscountedPrice = (couponDiscount?: number) => {
        const subtotal = parseFloat(calculateSubtotal(couponDiscount));
        return formatPrice(applyPixDiscount(subtotal, discountPix, couponDiscount));
    };
    
    /**
     * Calcula o frete com base no CEP usando a nova API
     * @param postalCode CEP para cálculo do frete
     * @param isAuthenticated Flag indicando se o usuário está autenticado
     * 
     * Para usuários autenticados, usa a função valorFrete que inclui o token de autenticação.
     * Para usuários não autenticados, usa a função valorFreteDeslogado que não requer autenticação.
     * Ambas funções usam o mesmo endpoint /cart/shipping, mas com headers diferentes.
     */
    const calculateShipping = async (postalCode: string, isAuthenticated: boolean) => {
        if (!postalCode || postalCode.length !== 9) return;
        
        // Remover máscara do CEP
        const cleanPostalCode = postalCode.replace('-', '');
        
        try {
            let response;
            
            // Usar funções específicas com base no status de autenticação
            if (isAuthenticated) {
                // Usuário autenticado - usa valorFrete
                response = await valorFrete(cleanPostalCode);
            } else {
                // Usuário não autenticado - usa valorFreteDeslogado
                
                // Formatar os dados dos produtos para o serviço
                const formattedProducts = cartData.map(item => ({
                    id: item.id || item.produto_id,
                    produto_id: item.produto_id || item.id,
                    quantity: item.qty || item.quantity || 1
                }));
                
                response = await valorFreteDeslogado(cleanPostalCode, formattedProducts);
            }
            
            
            // Processar a resposta no novo formato
            if (response?.data && response?.data.success) {
                const { data } = response.data;
                
                // Definir o serviço de frete selecionado - pegamos o primeiro disponível
                if (data.availableServices && data.availableServices.length > 0) {
                    const selectedService = data.availableServices[0];
                    setFreteNome(selectedService.serviceName);
                    setFretePreco(selectedService.price);
                    setPrazo(selectedService.deliveryTime);
                } else {
                    // Se não houver serviços disponíveis, definir valores padrão
                    setFreteNome('');
                    setFretePreco(0);
                    setPrazo(0);
                }
            } else {
                throw new Error('Falha ao calcular o frete');
            }
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            // Resetar valores em caso de erro
            setFreteNome('');
            setFretePreco(0);
            setPrazo(0);
            throw error;
        }
    };
    
    return {
        freteNome,
        fretePreco,
        prazo,
        discountPix,
        calculateSubtotal,
        calculateRawTotal,
        getPixDiscountedPrice,
        calculateShipping
    };
}; 