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
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata um CPF adicionando pontos e traço
 * @param cpf CPF a ser formatado
 * @returns CPF formatado (ex: 123.456.789-00)
 */
export const formatCPF = (cpf: string): string => {
  // Remove caracteres não numéricos
  const cpfDigits = cpf.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedCpf = cpfDigits.slice(0, 11);
  
  // Aplica a máscara
  if (limitedCpf.length <= 3) {
    return limitedCpf;
  } else if (limitedCpf.length <= 6) {
    return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3)}`;
  } else if (limitedCpf.length <= 9) {
    return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3, 6)}.${limitedCpf.slice(6)}`;
  } else {
    return `${limitedCpf.slice(0, 3)}.${limitedCpf.slice(3, 6)}.${limitedCpf.slice(6, 9)}-${limitedCpf.slice(9)}`;
  }
};

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY) para o formato de input HTML (YYYY-MM-DD)
 * @param date Data no formato brasileiro
 * @returns Data no formato YYYY-MM-DD
 */
export const formatDateForInput = (date: string): string => {
  if (!date) return '';
  
  // Verifica se a data já está no formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Converte de DD/MM/YYYY para YYYY-MM-DD
  const parts = date.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  
  return '';
};

/**
 * Formata uma data no formato de input HTML (YYYY-MM-DD) para o formato da API (YYYY-MM-DD)
 * @param date Data no formato YYYY-MM-DD
 * @returns Data no formato YYYY-MM-DD para a API
 */
export const formatDateForAPI = (date: string): string => {
  if (!date) return '';
  
  // A data já está no formato correto para a API
  return date;
};

/**
 * Formata um número de telefone adicionando parênteses e hífen
 * @param phone Número de telefone a ser formatado
 * @returns Telefone formatado (ex: (11) 98765-4321)
 */
export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const phoneDigits = phone.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedPhone = phoneDigits.slice(0, 11);
  
  // Aplica a máscara
  if (limitedPhone.length <= 2) {
    return limitedPhone;
  } else if (limitedPhone.length <= 6) {
    return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2)}`;
  } else {
    return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2, 7)}-${limitedPhone.slice(7)}`;
  }
}; 