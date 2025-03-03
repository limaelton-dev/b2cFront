// Tipagem para o objeto window do Mercado Pago
declare global {
    interface Window {
        MercadoPago: any;
            cardPayment: {
            createCardToken: (data: {
                cardNumber: string;
                cardholderName: string;
                cardExpirationMonth: string;
                cardExpirationYear: string;
                securityCode: string;
                identificationType: string;
                identificationNumber: string;
            }) => Promise<{
                id: string;
                status: string;
                card_number_length: number;
                date_created: string;
                date_last_updated: string;
                date_due: string;
                luhn_validation: boolean;
                live_mode: boolean;
                require_esc: boolean;
                card_number_validation: boolean;
                security_code_validation: boolean;
            }>;
        };
    }
  }
  
  export interface CardFormData {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
    email: string;
  }
  
  export interface PaymentData {
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