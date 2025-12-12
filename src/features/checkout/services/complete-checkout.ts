import { getProfileDetails } from '@/api/user';
import { saveCustomerProfile, saveCustomerPhone, saveCustomerAddress, saveCustomerCard } from './customer-profile';
import { processCreditCardPayment, processPixPayment } from '@/api/checkout/services/checkout-service';
import { generateCardToken } from '@/api/checkout/services/mercado-pago';
import { CheckoutFormData } from '../hooks/useCheckoutCustomer';
import { detectCardBrand } from '../utils/validation';

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

const MAX_PROFILE_RETRIES = 5;
const RETRY_DELAY_MS = 300;

/**
 * Aguarda o perfil estar disponível após registro, com polling em vez de delay fixo
 */
async function waitForProfile(maxRetries = MAX_PROFILE_RETRIES): Promise<number> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const profile = await getProfileDetails();
            if (profile?.id) {
                return profile.id;
            }
        } catch {
            // Perfil ainda não disponível, tentar novamente
        }
        
        if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
    
    throw new Error('Não foi possível obter perfil após várias tentativas');
}

async function getCustomerProfileId(
    isAuthenticated: boolean, 
    customerData: any, 
    onRegister: (customerData: any) => Promise<any>
): Promise<number> {
    if (!isAuthenticated) {
        const registerResponse = await onRegister(customerData);
        if (!registerResponse) throw new Error('Falha ao criar conta');
        
        return waitForProfile();
    }
    
    const profile = await getProfileDetails();
    if (!profile?.id) throw new Error('Não foi possível obter perfil');
    
    return profile.id;
}

async function saveAllCustomerData(
    profileId: number, 
    formData: CheckoutFormData, 
    isAuthenticated: boolean,
    maskedCard: MaskedCardData,
    shouldSaveCard: boolean
): Promise<void> {
    if (!isAuthenticated) {
        await saveCustomerProfile(profileId, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            cpf: formData.cpf,
            cnpj: formData.cnpj,
            tradingName: formData.tradingName,
            stateRegistration: formData.stateRegistration,
            profileType: formData.profileType === '1' ? 'PF' : 'PJ'
        });
        
        await saveCustomerPhone({ phone: formData.phone });
    }
    
    await saveCustomerAddress(profileId, {
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode
    });
    
    if (!maskedCard.isMasked && shouldSaveCard && formData.cardNumber) {
        const [expMonth, expYear] = formData.cardExpirationDate.split('/');
        await saveCustomerCard(profileId, {
            cardNumber: formData.cardNumber,
            holderName: formData.cardHolderName || `${formData.firstName} ${formData.lastName}`.trim(),
            expirationMonth: expMonth,
            expirationYear: expYear.length === 2 ? `20${expYear}` : expYear,
            cvv: formData.cardCVV
        });
    }
}

function formatAddress(formData: CheckoutFormData): string {
    return `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.postalCode}`;
}

function cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
}

function getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
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
        identificationNumber: cleanCpf(formData.cardHolderDocument)
    });
    
    return tokenResponse.id;
}

export async function completeCheckoutWithCreditCard(
    formData: CheckoutFormData,
    maskedCard: MaskedCardData,
    isAuthenticated: boolean,
    onRegister: (customerData: any) => Promise<any>
): Promise<CheckoutResult> {
    if (maskedCard.isMasked && !formData.cardCVV) {
        return {
            success: false,
            message: 'Informe o CVV do cartão para continuar'
        };
    }
    
    const profileId = await getCustomerProfileId(
        isAuthenticated, 
        {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf
        },
        onRegister
    );
    
    await saveAllCustomerData(profileId, formData, isAuthenticated, maskedCard, formData.saveCard);
    
    // Preparar dados de pagamento baseado no tipo de cartão
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
            cpf: cleanCpf(formData.cpf)
        }
    };
    
    let paymentData;
    
    if (maskedCard.isMasked) {
        // Cartão salvo: usar cardId + CVV informado agora
        paymentData = {
            ...basePaymentData,
            savedCardId: maskedCard.cardId,
            securityCode: formData.cardCVV,
            expirationDate: maskedCard.expiration
        };
    } else {
        // Cartão novo: tokenizar via Mercado Pago SDK
        try {
            const token = await tokenizeCard(formData);
            paymentData = {
                ...basePaymentData,
                token,
                expirationDate: formData.cardExpirationDate
            };
        } catch (tokenError: any) {
            return {
                success: false,
                message: tokenError?.message || 'Erro ao processar dados do cartão'
            };
        }
    }
    
    const response = await processCreditCardPayment(paymentData);
    
    if (response?.success) {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.order?.orderId || response.transactionId}`
        };
    }
    
    return {
        success: false,
        message: response?.message || 'Erro no processamento'
    };
}

export async function completeCheckoutWithPix(
    formData: CheckoutFormData,
    totalAmount: number,
    isAuthenticated: boolean,
    onRegister: (customerData: any) => Promise<any>
): Promise<CheckoutResult> {
    const profileId = await getCustomerProfileId(
        isAuthenticated,
        {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf
        },
        onRegister
    );
    
    const emptyMaskedCard: MaskedCardData = { 
        isMasked: false, 
        cardId: 0, 
        finalDigits: '', 
        cardHolder: '', 
        expiration: '',
        brand: ''
    };
    await saveAllCustomerData(profileId, formData, isAuthenticated, emptyMaskedCard, false);
    
    const pixPaymentData = {
        amount: totalAmount,
        description: "Pagamento via PIX",
        address: formatAddress(formData),
        customerData: { 
            name: getFullName(formData.firstName, formData.lastName), 
            email: formData.email,
            cpf: cleanCpf(formData.cpf)
        }
    };
    
    const response = await processPixPayment(pixPaymentData);
    
    if (response?.success) {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.order?.orderId || response.transactionId}`
        };
    }
    
    return {
        success: false,
        message: response?.message || 'Erro ao gerar PIX'
    };
}
