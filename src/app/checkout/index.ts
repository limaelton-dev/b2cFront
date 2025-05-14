/**
 * Arquivo de exportação para o módulo de checkout
 * Facilita a importação de componentes e hooks em outros lugares da aplicação
 */

// Componente principal
export { default as CheckoutPage } from './CheckoutPage';

// Componentes
export { default as PersonalInfoForm } from './components/PersonalInfoForm';
export { default as AddressForm } from './components/AddressForm';
export { default as PaymentForm } from './components/PaymentForm';

// Hooks
export { useCheckoutForm } from './hooks/useCheckoutForm';
export { useCheckoutPricing } from './hooks/useCheckoutPricing';

// Tipos
export type { CheckoutFormData, FormErrors, DisabledFields } from './hooks/useCheckoutForm';

// Utilitários
export * from './utils/pricing';
export * from './utils/validation';
export * from './utils/address'; 