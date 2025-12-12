import { processCheckout, processCreditCardPayment, processPixPayment } from '@/api/checkout/services/checkout-service';
import { generateCardToken } from '@/api/checkout/services/mercado-pago';
import { saveToken } from '@/utils/auth';
import { CheckoutFormData, SavedIds } from '../hooks/useCheckoutCustomer';
import { detectCardBrand } from '../utils/validation';
import type { 
    CheckoutRequest, 
    CheckoutCard, 
    CheckoutProfilePF, 
    CheckoutProfilePJ,
    CheckoutAddress,
    CheckoutPhone
} from '@/api/checkout/types';

interface CheckoutResult {
    success: boolean;
    redirectUrl?: string;
    message?: string;
}

interface MaskedCardData {
    isMasked: boolean;
    cardId: number;
    finalDigits: string;
    cardHolder: string;
    expiration: string;
    brand: string;
}

function cleanDocument(value: string): string {
    return value.replace(/\D/g, '');
}

function formatAddress(formData: CheckoutFormData): string {
    return `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.postalCode}`;
}

function getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
}

function convertBirthDateToISO(dateStr?: string): string | undefined {
    if (!dateStr || dateStr.length < 10) return undefined;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

function buildCheckoutCard(formData: CheckoutFormData, cardToken: string): CheckoutCard {
    const [expMonth, expYear] = formData.cardExpirationDate.split('/');
    
    const card: CheckoutCard = { cardToken };
    
    if (formData.saveCard) {
        card.saveCard = true;
        card.lastFourDigits = formData.cardNumber.replace(/\s/g, '').slice(-4);
        card.holderName = formData.cardHolderName || getFullName(formData.firstName, formData.lastName);
        card.expirationMonth = expMonth;
        card.expirationYear = expYear.length === 2 ? `20${expYear}` : expYear;
        card.brand = detectCardBrand(formData.cardNumber);
        card.isDefault = true;
    }
    
    return card;
}

function buildAddress(formData: CheckoutFormData, savedIds: SavedIds, isAuthenticated: boolean): CheckoutAddress {
    if (isAuthenticated && savedIds.addressId) {
        return { id: savedIds.addressId, isDefault: true };
    }
    
    return {
        street: formData.street,
        number: formData.number,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: cleanDocument(formData.postalCode),
        isDefault: true
    };
}

function buildPhone(formData: CheckoutFormData, savedIds: SavedIds, isAuthenticated: boolean): CheckoutPhone {
    if (isAuthenticated && savedIds.phoneId) {
        return { id: savedIds.phoneId };
    }
    
    return {
        ddd: cleanDocument(formData.phone).substring(0, 2),
        number: cleanDocument(formData.phone).substring(2),
        isDefault: true
    };
}

function buildCheckoutRequest(
    formData: CheckoutFormData,
    isAuthenticated: boolean,
    savedIds: SavedIds,
    card?: CheckoutCard
): CheckoutRequest {
    const profileType = formData.profileType === '1' ? 'PF' : 'PJ';
    
    const profile = profileType === 'PF'
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            cpf: cleanDocument(formData.cpf),
            birthDate: convertBirthDateToISO(formData.birthDate),
            gender: undefined
        } as CheckoutProfilePF
        : {
            companyName: formData.tradingName,
            cnpj: cleanDocument(formData.cnpj),
            tradingName: formData.tradingName
        } as CheckoutProfilePJ;

    const phone = buildPhone(formData, savedIds, isAuthenticated);
    const address = buildAddress(formData, savedIds, isAuthenticated);

    if (isAuthenticated) {
        return {
            isRegistered: true,
            profileType,
            profile,
            phone,
            address,
            card
        };
    }

    return {
        isRegistered: false,
        email: formData.email,
        password: formData.password,
        profileType,
        profile,
        phone,
        address,
        card
    };
}

async function tokenizeCard(formData: CheckoutFormData): Promise<string> {
    const [expMonth, expYear] = formData.cardExpirationDate.split('/');
    
    const tokenResponse = await generateCardToken({
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardholderName: formData.cardHolderName,
        cardExpirationMonth: expMonth,
        cardExpirationYear: expYear.length === 2 ? `20${expYear}` : expYear,
        securityCode: formData.cardCVV,
        identificationType: 'CPF',
        identificationNumber: cleanDocument(formData.cardHolderDocument)
    });
    
    return tokenResponse.id;
}

export async function completeCheckoutWithCreditCard(
    formData: CheckoutFormData,
    maskedCard: MaskedCardData,
    isAuthenticated: boolean,
    savedIds: SavedIds = {}
): Promise<CheckoutResult> {
    if (maskedCard.isMasked && !formData.cardCVV) {
        return { success: false, message: 'Informe o CVV do cartão para continuar' };
    }

    let cardToken: string;
    let card: CheckoutCard | undefined;

    if (maskedCard.isMasked) {
        cardToken = '';
    } else {
        try {
            cardToken = await tokenizeCard(formData);
            card = buildCheckoutCard(formData, cardToken);
        } catch (tokenError: any) {
            return { success: false, message: tokenError?.message || 'Erro ao processar dados do cartão' };
        }
    }

    const checkoutRequest = buildCheckoutRequest(formData, isAuthenticated, savedIds, card);
    const checkoutResponse = await processCheckout(checkoutRequest);
    
    if (checkoutResponse.accessToken) {
        saveToken(checkoutResponse.accessToken);
    }

    const customerFullName = getFullName(formData.firstName, formData.lastName);
    const basePaymentData = {
        holder: formData.cardHolderName,
        brand: maskedCard.isMasked ? maskedCard.brand : detectCardBrand(formData.cardNumber),
        description: "Compra online",
        installments: 1,
        address: formatAddress(formData),
        customerData: { 
            name: customerFullName, 
            email: formData.email,
            cpf: cleanDocument(formData.cpf)
        }
    };

    const paymentData = maskedCard.isMasked
        ? {
            ...basePaymentData,
            savedCardId: maskedCard.cardId,
            securityCode: formData.cardCVV,
            expirationDate: maskedCard.expiration
        }
        : {
            ...basePaymentData,
            token: cardToken,
            expirationDate: formData.cardExpirationDate
        };

    const response = await processCreditCardPayment(paymentData);
    
    if (response?.success) {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.order?.orderId || response.transactionId}`
        };
    }
    
    return { success: false, message: response?.message || 'Erro no processamento' };
}

export async function completeCheckoutWithPix(
    formData: CheckoutFormData,
    totalAmount: number,
    isAuthenticated: boolean,
    savedIds: SavedIds = {}
): Promise<CheckoutResult> {
    const checkoutRequest = buildCheckoutRequest(formData, isAuthenticated, savedIds);
    const checkoutResponse = await processCheckout(checkoutRequest);
    
    if (checkoutResponse.accessToken) {
        saveToken(checkoutResponse.accessToken);
    }

    const pixPaymentData = {
        amount: totalAmount,
        description: "Pagamento via PIX",
        address: formatAddress(formData),
        customerData: { 
            name: getFullName(formData.firstName, formData.lastName), 
            email: formData.email,
            cpf: cleanDocument(formData.cpf)
        }
    };
    
    const response = await processPixPayment(pixPaymentData);
    
    if (response?.success) {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.order?.orderId || response.transactionId}`
        };
    }
    
    return { success: false, message: response?.message || 'Erro ao gerar PIX' };
}
