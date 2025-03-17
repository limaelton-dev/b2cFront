'use strict';

export const loadMercadoPagoSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      resolve(window.MercadoPago);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    script.onload = () => {
      resolve(window.MercadoPago);
    };
    script.onerror = (error) => {
      reject(new Error('Falha ao carregar o SDK do Mercado Pago'));
    };

    document.body.appendChild(script);
  });
};

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

export const prepareCardData = (profile, securityCode) => {
  // Simplificando para usar sempre o cartão de teste, sem depender da estrutura de profile.cards
  
  // Cartão de teste para ambiente de desenvolvimento
  return {
    cardNumber: "5031433215406351",
    cardholderName: "APRO",
    cardExpirationMonth: "11",
    cardExpirationYear: "30",
    securityCode: securityCode || "123",
    identificationType: "CPF",
    identificationNumber: "12345678909"
  };
  
  // Código para produção (descomentar quando estiver pronto)
  // const [expirationMonth, expirationYear] = card.expiration_date.split('/');
  // return {
  //   cardNumber: card.card_number,
  //   cardholderName: card.holder_name,
  //   cardExpirationMonth: expirationMonth,
  //   cardExpirationYear: expirationYear.length === 2 ? `20${expirationYear}` : expirationYear,
  //   securityCode: securityCode,
  //   identificationType: "CPF",
  //   identificationNumber: profile.profilePF?.cpf?.replace(/[^\d]/g, '') || "12345678909"
  // };
};

// Função para preparar os dados do pagamento
export const preparePaymentData = (profile, token, cartTotal, installments = 1) => {
  // Usando "master" como método de pagamento padrão para testes
  const paymentMethodId = "master";
  
  return {
    transaction_amount: parseFloat(cartTotal),
    description: "Compra de produtos",
    payment_method_id: paymentMethodId,
    token: token,
    installments: installments,
    external_reference: "123",
    payer: {
      email: profile.user?.email || "test_user_123@testuser.com",
      identification: {
        type: "CPF",
        number: profile.profilePF?.cpf?.replace(/[^\d]/g, '') || "12345678909"
      },
      first_name: "APRO",
      last_name: "User"
    }
  };
}; 