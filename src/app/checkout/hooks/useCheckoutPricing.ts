"use client";
import { useState } from 'react';
import { applyDiscounts, applyPixDiscount, formatPrice } from '../utils/pricing';
import axios from 'axios';

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
     */
    const calculateShipping = async (postalCode: string, isAuthenticated: boolean) => {
        if (!postalCode || postalCode.length !== 9) return;
        
        // Remover máscara do CEP
        const cleanPostalCode = postalCode.replace('-', '');
        
        try {
            // Preparar os dados para a API
            const products = cartData.map(item => ({
                productId: Number(item.id || item.produto_id),
                quantity: Number(item.qty || item.quantity || 1)
            }));
            
            // CEP de origem padrão
            const originZipCode = "01001000";
            
            // Construir os headers com o token se o usuário estiver autenticado
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            
            if (isAuthenticated) {
                // Obter o token JWT dos cookies ou localStorage
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }
            
            // Fazer a requisição para a nova API
            const payload = {
                originZipCode,
                destinationZipCode: cleanPostalCode,
                products
            };
            
            console.log('Enviando requisição para API de frete:', payload);
            
            // Obter a URL base correta da variável de ambiente
            const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
            
            // Usar a URL completa com o endpoint de frete
            const response = await axios.get(
                `${API_URL}/cart/shipping?zipCode=${cleanPostalCode}`,
                {
                    headers,
                    data: payload
                }
            );
            
            console.log('Resposta da API de frete:', response.data);
            
            // Processar a resposta no novo formato
            if (response.data && response.data.success) {
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