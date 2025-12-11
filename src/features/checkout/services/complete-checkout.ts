import { getProfileDetails } from '@/api/user';
import { saveCustomerProfile, saveCustomerPhone, saveCustomerAddress, saveCustomerCard } from './customer-profile';
import { processCreditCardPayment, processPixPayment } from '@/api/checkout/services/checkout-service';
import { CheckoutFormData } from '../hooks/useCheckoutCustomer';
import { detectCardBrand } from '../utils/validation';

interface CheckoutResult {
    success: boolean;
    redirectUrl?: string;
    message?: string;
}

async function getCustomerProfileId(isAuthenticated: boolean, customerData: any, onRegister: (response: any) => Promise<void>): Promise<number> {
    if (!isAuthenticated) {
        const registerResponse = await onRegister(customerData);
        if (!registerResponse) throw new Error('Falha ao criar conta');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profileResponse = await getProfileDetails();
        if (!profileResponse?.profileId) throw new Error('Não foi possível obter perfil');
        
        return profileResponse.profileId;
    }
    
    const profileResponse = await getProfileDetails();
    if (!profileResponse?.profileId) throw new Error('Não foi possível obter perfil');
    
    return profileResponse.profileId;
}

async function saveAllCustomerData(
    profileId: number, 
    formData: CheckoutFormData, 
    isAuthenticated: boolean,
    maskedCard: any
): Promise<void> {
    if (!isAuthenticated) {
        await saveCustomerProfile(profileId, {
            fullName: formData.name,
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
    
    if (!maskedCard.isMasked && formData.saveCard && formData.cardNumber) {
        await saveCustomerCard(profileId, {
            cardNumber: formData.cardNumber,
            holderName: formData.name,
            expirationDate: formData.cardExpirationDate,
            cvv: formData.cardCVV
        });
    }
}

function formatAddress(formData: CheckoutFormData): string {
    return `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.postalCode}`;
}

export async function completeCheckoutWithCreditCard(
    formData: CheckoutFormData,
    maskedCard: any,
    isAuthenticated: boolean,
    onRegister: (customerData: any) => Promise<any>
): Promise<CheckoutResult> {
    const profileId = await getCustomerProfileId(
        isAuthenticated, 
        {
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf
        },
        onRegister
    );
    
    await saveAllCustomerData(profileId, formData, isAuthenticated, maskedCard);
    
    const cardNumber = maskedCard.isMasked 
        ? maskedCard.finalDigits.padStart(16, '0') 
        : formData.cardNumber.replace(/\s/g, '');
    
    const paymentData = {
        cardNumber,
        holder: formData.name,
        expirationDate: maskedCard.isMasked ? maskedCard.expiration : formData.cardExpirationDate,
        securityCode: maskedCard.isMasked ? '123' : formData.cardCVV,
        brand: detectCardBrand(cardNumber),
        description: "Compra online",
        installments: 1,
        address: formatAddress(formData),
        customerData: { name: formData.name, email: formData.email }
    };
    
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
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf
        },
        onRegister
    );
    
    const maskedCard = { isMasked: false, finalDigits: '', cardHolder: '', expiration: '' };
    await saveAllCustomerData(profileId, formData, isAuthenticated, maskedCard);
    
    const pixPaymentData = {
        amount: totalAmount,
        description: "Pagamento via PIX",
        address: formatAddress(formData),
        customerData: { name: formData.name, email: formData.email }
    };
    
    const response = await processPixPayment(pixPaymentData);
    
    if (response?.success) {
        return {
            success: true,
            redirectUrl: `/pix-checkout?pedido=${response.order?.orderId || response.transactionId}&qrcode=${encodeURIComponent(response.qrCode || '')}&key=${encodeURIComponent(response.pixKey || '')}`
        };
    }
    
    return {
        success: false,
        message: response?.message || 'Erro ao gerar PIX'
    };
}

