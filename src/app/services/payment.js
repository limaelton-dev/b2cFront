'use strict';
import axios from 'axios';
import { getToken } from '../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Função para validar o pagamento no backend
export const validatePayment = async (dados) => {
    const headerValidate = {
        Authorization: `Bearer ${getToken()}`
    };
    
    try {
        const response = await axios.post(`${API_URL}/checkout/validate`, dados, {headers: headerValidate});
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};

// Função para processar o pagamento com cartão de crédito
export const processCreditCardPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/checkout/credit-card`, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        console.log('Resposta do processamento de pagamento:', response.data);
        return response.data;
    }
    catch (err) {
        console.error('Erro ao processar pagamento com cartão:', err);
        throw err;
    }
};

// Função para processar o pagamento com PIX
export const processPixPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/checkout/pix`, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        console.log('Resposta do processamento de pagamento PIX:', response.data);
        return response.data;
    }
    catch (err) {
        console.error('Erro ao processar pagamento PIX:', err);
        throw err;
    }
};

// Função para formatar os dados do cartão de crédito para a API
export const formatCreditCardData = (paymentData) => {
    // Extrair mês e ano da data de expiração (formato MM/YYYY)
    const [expirationMonth, expirationYear] = paymentData.expirationDate.split('/');
    
    return {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        holder: paymentData.cardholderName,
        expirationDate: paymentData.expirationDate,
        securityCode: paymentData.securityCode,
        brand: paymentData.brand || detectCardBrand(paymentData.cardNumber),
        description: "Compra online",
        Installments: paymentData.installments || 1,
        address: paymentData.address,
        customerData: {
            name: paymentData.customerName,
            email: paymentData.customerEmail
        }
    };
};

// Função para detectar a bandeira do cartão
export const detectCardBrand = (cardNumber) => {
    // Remover espaços e caracteres não numéricos
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Visa: começa com 4
    if (/^4/.test(cleanNumber)) return "Visa";
    
    // Mastercard: começa com 5 seguido por 1-5
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    
    // Amex: começa com 34 ou 37
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    
    // Discover: começa com 6011 ou 65
    if (/^(6011|65)/.test(cleanNumber)) return "Discover";
    
    // Elo: vários padrões
    if (/^(401178|401179|438935|457631|457632|431274|451416|457393|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8])|(65092[1-9]|65097[0-8]))/.test(cleanNumber)) return "Elo";
    
    // Hipercard: começa com 606282
    if (/^(606282)/.test(cleanNumber)) return "Hipercard";
    
    return "Desconhecido";
};
