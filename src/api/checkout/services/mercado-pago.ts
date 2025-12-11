declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

interface CardToken {
  id: string;
}

interface PaymentData {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  token: string;
  installments: number;
  external_reference: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
    first_name: string;
    last_name: string;
  };
}

export function loadMercadoPagoSDK(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.MercadoPago) {
      resolve(window.MercadoPago);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    script.onload = () => resolve(window.MercadoPago);
    script.onerror = () => reject(new Error('Falha ao carregar o SDK do Mercado Pago'));
    document.body.appendChild(script);
  });
}

export async function initMercadoPago(): Promise<any> {
  const MercadoPago = await loadMercadoPagoSDK();
  return new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN);
}

export async function generateCardToken(cardData: CardData): Promise<CardToken> {
  const mp = await initMercadoPago();
  return mp.createCardToken(cardData);
}

export function prepareCardData(securityCode?: string): CardData {
  return {
    cardNumber: "5031433215406351",
    cardholderName: "APRO",
    cardExpirationMonth: "11",
    cardExpirationYear: "30",
    securityCode: securityCode || "123",
    identificationType: "CPF",
    identificationNumber: "12345678909"
  };
}

export function preparePaymentData(
  email: string,
  cpf: string,
  token: string,
  amount: number,
  installments = 1
): PaymentData {
  return {
    transaction_amount: amount,
    description: "Compra de produtos",
    payment_method_id: "master",
    token,
    installments,
    external_reference: `order-${Date.now()}`,
    payer: {
      email,
      identification: {
        type: "CPF",
        number: cpf.replace(/\D/g, '')
      },
      first_name: "Cliente",
      last_name: "Coletek"
    }
  };
}

