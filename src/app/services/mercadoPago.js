'use strict';

/**
 * Serviço para integração com o Mercado Pago
 * Implementa a lógica de geração de token e processamento de pagamento
 */

// Função para carregar o SDK do Mercado Pago
export const loadMercadoPagoSDK = () => {
  return new Promise((resolve, reject) => {
    // Verifica se o SDK já está carregado
    if (window.MercadoPago) {
      resolve(window.MercadoPago);
      return;
    }

    // Cria o script para carregar o SDK
    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    script.onload = () => {
      resolve(window.MercadoPago);
    };
    script.onerror = (error) => {
      reject(new Error('Falha ao carregar o SDK do Mercado Pago'));
    };

    // Adiciona o script ao documento
    document.body.appendChild(script);
  });
};

// Função para inicializar o SDK do Mercado Pago
export const initMercadoPago = async () => {
  try {
    const MercadoPago = await loadMercadoPagoSDK();
    return new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN);
  } catch (error) {
    console.error('Erro ao inicializar o Mercado Pago:', error);
    throw error;
  }
};

// Função para gerar o token do cartão
export const generateCardToken = async (cardData) => {
  try {
    const mp = await initMercadoPago();
    const cardToken = await mp.createCardToken(cardData);
    return cardToken;
  } catch (error) {
    console.error('Erro ao gerar token do cartão:', error);
    throw error;
  }
};

// Função para preparar os dados do cartão a partir do perfil do usuário
export const prepareCardData = (profile, securityCode) => {
  // Verifica se o usuário tem cartões cadastrados
  if (!profile.cards || profile.cards.length === 0) {
    throw new Error('Nenhum cartão cadastrado');
  }

  // Pega o primeiro cartão (ou o cartão padrão, se implementado)
  const card = profile.cards[0];
  
  // Extrai mês e ano da data de expiração (formato MM/YY ou MM/YYYY)
  const [expirationMonth, expirationYear] = card.expiration_date.split('/');
  
  // Prepara os dados do cartão no formato esperado pelo Mercado Pago
  return {
    cardNumber: card.card_number,
    cardholderName: card.holder_name,
    cardExpirationMonth: expirationMonth,
    cardExpirationYear: expirationYear.length === 2 ? `20${expirationYear}` : expirationYear,
    securityCode: securityCode,
    identificationType: "CPF",
    identificationNumber: profile.profilePF?.cpf?.replace(/[^\d]/g, '') || "12345678909"
  };
};

// Função para preparar os dados do pagamento
export const preparePaymentData = (profile, token, cartTotal, installments = 1) => {
  // Determina o tipo de cartão (visa, master, amex, etc)
  const paymentMethodId = profile.cards[0].card_type?.toLowerCase() || "master";
  
  return {
    transaction_amount: parseFloat(cartTotal),
    description: "Compra de produtos",
    payment_method_id: paymentMethodId,
    token: token,
    installments: installments,
    external_reference: `order-${Date.now()}`,
    payer: {
      email: profile.user?.email || "test_user_123@testuser.com",
      identification: {
        type: "CPF",
        number: profile.profilePF?.cpf?.replace(/[^\d]/g, '') || "12345678909"
      },
      first_name: profile.profilePF?.full_name?.split(' ')[0] || profile.user?.name || "User",
      last_name: profile.profilePF?.full_name?.split(' ').slice(1).join(' ') || profile.user?.lastname || "User"
    }
  };
}; 