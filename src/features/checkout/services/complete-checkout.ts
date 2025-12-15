import { 
    processGuestCheckout, 
    processRegisteredCheckout, 
    createOrder,
    processPixPaymentWithGateway,
    processCreditCardPaymentWithGateway,
    processDebitCardPaymentWithGateway
} from '@/api/checkout/services/checkout-service';
import { generateCardToken } from '@/api/checkout/services/mercado-pago';
import { addItemAPI } from '@/api/cart/services/cart-service';
import { loadGuestCart, clearGuestCart } from '@/utils/cart-storage';
import { saveToken } from '@/utils/auth';
import { CheckoutFormData, SavedIds } from '../hooks/useCheckoutCustomer';
import { detectCardBrand } from '../utils/validation';
import type { 
    GuestCheckoutRequest,
    RegisteredCheckoutRequest,
    RegisteredCheckoutProfile,
    CreateOrderRequest,
    CheckoutCard,
    CheckoutProfilePF, 
    CheckoutProfilePJ,
    CheckoutAddressNew,
    CheckoutPhoneNew,
    PaymentResponse
} from '@/api/checkout/types';

interface CheckoutResult {
    success: boolean;
    redirectUrl?: string;
    message?: string;
    pixData?: {
        qrCode: string;
        qrCodeBase64: string;
        expirationDate: string;
    };
}

interface MaskedCardData {
    isMasked: boolean;
    cardId: number;
    finalDigits: string;
    cardHolder: string;
    expiration: string;
    brand: string;
}

interface CheckoutState {
    orderId: number;
    addressId: number;
}

function generateIdempotencyKey(): string {
    return crypto.randomUUID();
}

function cleanDocument(value: string): string {
    return value.replace(/\D/g, '');
}

function getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
}

function convertBirthDateToISO(dateStr?: string): string | undefined {
    if (!dateStr || dateStr.length < 10) return undefined;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

function buildProfilePF(formData: CheckoutFormData): CheckoutProfilePF {
    return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        cpf: cleanDocument(formData.cpf),
        birthDate: convertBirthDateToISO(formData.birthDate),
        gender: undefined
    };
}

function buildProfilePJ(formData: CheckoutFormData): CheckoutProfilePJ {
    return {
        companyName: formData.tradingName,
        cnpj: cleanDocument(formData.cnpj),
        tradingName: formData.tradingName,
        stateRegistration: formData.stateRegistration || undefined
    };
}

function buildAddressNew(formData: CheckoutFormData): CheckoutAddressNew {
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

function buildPhoneNew(formData: CheckoutFormData): CheckoutPhoneNew {
    const cleanPhone = cleanDocument(formData.phone);
    return {
        ddd: cleanPhone.substring(0, 2),
        number: cleanPhone.substring(2),
        isDefault: true
    };
}

function buildCheckoutCard(formData: CheckoutFormData): CheckoutCard | undefined {
    if (!formData.saveCard) return undefined;
    
    const [expMonth, expYear] = formData.cardExpirationDate.split('/');
    
    return {
        saveCard: true,
        lastFourDigits: formData.cardNumber.replace(/\s/g, '').slice(-4),
        holderName: formData.cardHolderName || getFullName(formData.firstName, formData.lastName),
        expirationMonth: expMonth,
        expirationYear: expYear.length === 2 ? `20${expYear}` : expYear,
        brand: detectCardBrand(formData.cardNumber),
        isDefault: true
    };
}

async function migrateGuestCartToServer(): Promise<void> {
    const guestCart = loadGuestCart();
    if (!guestCart?.items?.length) return;
    
    for (const item of guestCart.items) {
        for (let i = 0; i < item.quantity; i++) {
            await addItemAPI(item.skuId, item.productId);
        }
    }
    
    clearGuestCart();
}

async function processGuestFlow(formData: CheckoutFormData): Promise<{ addressId?: number }> {
    const profileType = formData.profileType === '1' ? 'PF' : 'PJ';
    const profile = profileType === 'PF' ? buildProfilePF(formData) : buildProfilePJ(formData);
    
    const request: GuestCheckoutRequest = {
        email: formData.email,
        password: formData.password,
        profileType,
        profile,
        address: buildAddressNew(formData),
        phone: buildPhoneNew(formData),
        card: buildCheckoutCard(formData)
    };
    
    const response = await processGuestCheckout(request);
    
    if (response.accessToken) {
        saveToken(response.accessToken);
        await migrateGuestCartToServer();
    }
    
    return {};
}

async function processRegisteredFlow(
    formData: CheckoutFormData, 
    savedIds: SavedIds
): Promise<{ addressId: number }> {
    const profileType = formData.profileType === '1' ? 'PF' : 'PJ';
    
    const profile: RegisteredCheckoutProfile = profileType === 'PF' 
        ? { pf: buildProfilePF(formData) }
        : { pj: buildProfilePJ(formData) };
    
    const address = savedIds.addressId 
        ? { id: savedIds.addressId, isDefault: true }
        : buildAddressNew(formData);
    
    const phone = savedIds.phoneId 
        ? { id: savedIds.phoneId }
        : buildPhoneNew(formData);
    
    const request: RegisteredCheckoutRequest = {
        profile,
        address,
        phone,
        card: buildCheckoutCard(formData)
    };
    
    const response = await processRegisteredCheckout(request);
    
    return { addressId: response.addressId };
}

async function createOrderFlow(
    addressId: number | undefined,
    shippingOptionCode: string
): Promise<{ orderId: number }> {
    const idempotencyKey = generateIdempotencyKey();
    
    const request: CreateOrderRequest = addressId 
        ? { shippingAddressId: addressId, shippingOptionCode }
        : { shippingOptionCode };
    
    const response = await createOrder(request, idempotencyKey);
    
    return { orderId: response.orderId };
}

// #region DEV_TEST_CARD - REMOVER EM PRODUÇÃO
const USE_TEST_CARD = process.env.NODE_ENV === 'development';
const TEST_CARD_DATA = {
    cardNumber: "5031433215406351",
    cardholderName: "APRO",
    cardExpirationMonth: "11",
    cardExpirationYear: "2030",
    identificationType: "CPF",
    identificationNumber: "12345678909"
};
// #endregion DEV_TEST_CARD

async function tokenizeCard(formData: CheckoutFormData): Promise<string> {
    const [expMonth, expYear] = formData.cardExpirationDate.split('/');
    
    // #region DEV_TEST_CARD - REMOVER EM PRODUÇÃO
    if (USE_TEST_CARD) {
        console.warn('[DEV] Usando cartão de teste do Mercado Pago');
        const tokenResponse = await generateCardToken({
            ...TEST_CARD_DATA,
            securityCode: "123"
        });
        return tokenResponse.id;
    }
    // #endregion DEV_TEST_CARD
    
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

function handlePaymentResponse(response: PaymentResponse, paymentMethod: 'pix' | 'card'): CheckoutResult {
    if (response.status === 'approved') {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.transactionId}`
        };
    }
    
    if (response.status === 'pending' && paymentMethod === 'pix' && response.pixData) {
        return {
            success: true,
            redirectUrl: `/pix-checkout?transaction=${response.transactionId}`,
            pixData: response.pixData
        };
    }
    
    if (response.status === 'rejected') {
        return { success: false, message: response.message || 'Pagamento recusado' };
    }
    
    if (response.status === 'in_process') {
        return {
            success: true,
            redirectUrl: `/pagamento-sucesso?pedido=${response.transactionId}&status=processing`,
            message: 'Pagamento em análise'
        };
    }
    
    return { success: false, message: response.message || 'Erro no processamento' };
}

export async function completeCheckoutWithCreditCard(
    formData: CheckoutFormData,
    maskedCard: MaskedCardData,
    isAuthenticated: boolean,
    savedIds: SavedIds = {},
    shippingOptionCode: string = 'PAC'
): Promise<CheckoutResult> {
    if (maskedCard.isMasked && !formData.cardCVV) {
        return { success: false, message: 'Informe o CVV do cartão para continuar' };
    }

    try {
        let state: CheckoutState;
        
        if (isAuthenticated) {
            const { addressId } = await processRegisteredFlow(formData, savedIds);
            const { orderId } = await createOrderFlow(addressId, shippingOptionCode);
            state = { orderId, addressId };
        } else {
            await processGuestFlow(formData);
            const { orderId } = await createOrderFlow(undefined, shippingOptionCode);
            state = { orderId, addressId: 0 };
        }
        
        let cardToken: string;
        if (maskedCard.isMasked) {
            cardToken = await tokenizeCard({ ...formData, cardNumber: `****${maskedCard.finalDigits}` });
        } else {
            cardToken = await tokenizeCard(formData);
        }
        
        const idempotencyKey = generateIdempotencyKey();
        const response = await processCreditCardPaymentWithGateway({
            orderId: state.orderId,
            description: 'Pagamento do pedido',
            card: {
                token: cardToken,
                brand: maskedCard.isMasked ? maskedCard.brand : detectCardBrand(formData.cardNumber)
            },
            installments: 1,
            payerIdentification: {
                type: 'CPF',
                number: cleanDocument(formData.cardHolderDocument || formData.cpf)
            }
        }, idempotencyKey);
        
        return handlePaymentResponse(response, 'card');
        
    } catch (error: any) {
        console.log("ERRO AQUI: ", error)
        return { success: false, message: error?.message || 'Erro ao processar pagamento' };
    }
}

export async function completeCheckoutWithDebitCard(
    formData: CheckoutFormData,
    maskedCard: MaskedCardData,
    isAuthenticated: boolean,
    savedIds: SavedIds = {},
    shippingOptionCode: string = 'PAC'
): Promise<CheckoutResult> {
    if (maskedCard.isMasked && !formData.cardCVV) {
        return { success: false, message: 'Informe o CVV do cartão para continuar' };
    }

    try {
        let state: CheckoutState;
        
        if (isAuthenticated) {
            const { addressId } = await processRegisteredFlow(formData, savedIds);
            const { orderId } = await createOrderFlow(addressId, shippingOptionCode);
            state = { orderId, addressId };
        } else {
            await processGuestFlow(formData);
            const { orderId } = await createOrderFlow(undefined, shippingOptionCode);
            state = { orderId, addressId: 0 };
        }
        
        let cardToken: string;
        if (maskedCard.isMasked) {
            cardToken = await tokenizeCard({ ...formData, cardNumber: `****${maskedCard.finalDigits}` });
        } else {
            cardToken = await tokenizeCard(formData);
        }
        
        const idempotencyKey = generateIdempotencyKey();
        const response = await processDebitCardPaymentWithGateway({
            orderId: state.orderId,
            card: {
                token: cardToken,
                brand: maskedCard.isMasked ? maskedCard.brand : detectCardBrand(formData.cardNumber)
            }
        }, idempotencyKey);
        
        return handlePaymentResponse(response, 'card');
        
    } catch (error: any) {
        return { success: false, message: error?.message || 'Erro ao processar pagamento' };
    }
}

export async function completeCheckoutWithPix(
    formData: CheckoutFormData,
    _totalAmount: number,
    isAuthenticated: boolean,
    savedIds: SavedIds = {},
    shippingOptionCode: string = 'PAC'
): Promise<CheckoutResult> {
    try {
        let state: CheckoutState;
        
        if (isAuthenticated) {
            const { addressId } = await processRegisteredFlow(formData, savedIds);
            const { orderId } = await createOrderFlow(addressId, shippingOptionCode);
            state = { orderId, addressId };
        } else {
            await processGuestFlow(formData);
            const { orderId } = await createOrderFlow(undefined, shippingOptionCode);
            state = { orderId, addressId: 0 };
        }
        
        const idempotencyKey = generateIdempotencyKey();
        const response = await processPixPaymentWithGateway({
            orderId: state.orderId,
            description: 'Pagamento do pedido',
            payerIdentification: {
                type: 'CPF',
                number: cleanDocument(formData.cpf)
            }
        }, idempotencyKey);
        
        return handlePaymentResponse(response, 'pix');
        
    } catch (error: any) {
        return { success: false, message: error?.message || 'Erro ao gerar PIX' };
    }
}
