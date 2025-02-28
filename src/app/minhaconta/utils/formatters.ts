/**
 * Formata um número de cartão de crédito para exibição
 * @param cardNumber Número do cartão
 * @returns Número formatado com máscara
 */
export const formatCreditCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return '';
  return '**** '.repeat(3) + cardNumber.slice(-4);
};

/**
 * Formata um valor monetário para exibição
 * @param value Valor em número
 * @returns Valor formatado como moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um CPF para exibição
 * @param cpf CPF sem formatação
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um número de telefone para exibição
 * @param phone Número de telefone
 * @returns Telefone formatado
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se é um número com DDD e 9 dígitos
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '+55 ($1) $2$3-$4');
  }
  
  // Verifica se é um número com DDD e 8 dígitos
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '+55 ($1) $2-$3');
  }
  
  return phone;
}; 