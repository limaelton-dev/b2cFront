'use strict';

/**
 * Script de teste para verificar a integração com o Mercado Pago
 * Este arquivo pode ser usado para testar a integração com o Mercado Pago
 * sem precisar passar por todo o fluxo de checkout
 */

import { loadMercadoPagoSDK, initMercadoPago, generateCardToken } from './mercadoPago';
import { processPayment } from './payment';
import { getToken } from '../utils/auth';

// Dados de teste do cartão
const testCardData = {
    cardNumber: "5031433215406351",
    cardholderName: "APRO",
    cardExpirationMonth: "11",
    cardExpirationYear: "30",
    securityCode: "123",
    identificationType: "CPF",
    identificationNumber: "12345678909"
};

// Função para testar a geração de token
export const testGenerateToken = async () => {
    try {
        console.log('Iniciando teste de geração de token...');
        
        // Inicializa o SDK do Mercado Pago
        await loadMercadoPagoSDK();
        
        // Gera o token do cartão
        const cardToken = await generateCardToken(testCardData);
        
        console.log('Token gerado com sucesso:', cardToken);
        
        // Prepara os dados para o processamento do pagamento
        const paymentData = {
            transaction_amount: 100,
            description: "Teste de integração com o Mercado Pago",
            payment_method_id: "master",
            token: cardToken.id,
            installments: 1,
            external_reference: `test-${Date.now()}`,
            payer: {
                email: "test_user_123@testuser.com",
                identification: {
                    type: "CPF",
                    number: "5031433215406351"
                },
                first_name: "APRO",
                last_name: "User"
            }
        };
        
        console.log('Dados para processamento do pagamento:', paymentData);
        
        // Processa o pagamento
        const paymentResponse = await processPayment(paymentData, getToken());
        
        console.log('Resposta do processamento do pagamento:', paymentResponse);
        
        return {
            success: true,
            cardToken,
            paymentResponse
        };
    } catch (error) {
        console.error('Erro ao testar a geração de token:', error);
        return {
            success: false,
            error
        };
    }
}; 