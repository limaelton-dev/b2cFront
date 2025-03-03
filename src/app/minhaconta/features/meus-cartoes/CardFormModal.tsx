import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material';
import { CartaoType } from '../../types';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Função para formatar o número do cartão
const formatCardNumber = (value: string) => {
  if (!value) return '';
  
  // Remove todos os espaços e caracteres não numéricos
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  // Limita a 16 dígitos
  const cardNumber = v.slice(0, 16);
  
  // Formata com espaços a cada 4 dígitos
  const parts = [];
  for (let i = 0; i < cardNumber.length; i += 4) {
    parts.push(cardNumber.substring(i, i + 4));
  }
  
  return parts.join(' ');
};

// Função para validar o número do cartão
const validateCardNumber = (cardNumber: string): boolean => {
  // Remove espaços e caracteres não numéricos
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  // Verifica se o número tem entre 13 e 16 dígitos (padrão para a maioria dos cartões)
  return cleanNumber.length >= 13 && cleanNumber.length <= 16;
};

// Função para formatar a data de expiração
const formatExpiryDate = (value: string) => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos e a barra
  const v = value.replace(/[^0-9]/gi, '');
  
  // Limita a 4 dígitos (MM/YY)
  const expiry = v.slice(0, 4);
  
  if (expiry.length > 2) {
    return `${expiry.slice(0, 2)}/${expiry.slice(2)}`;
  }
  
  return expiry;
};

// Função para formatar o CVV
const formatCVV = (value: string) => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const v = value.replace(/[^0-9]/gi, '');
  
  // Limita a 4 dígitos (alguns cartões têm CVV de 4 dígitos)
  return v.slice(0, 4);
};

// Função para detectar a bandeira do cartão
const detectCardType = (cardNumber: string) => {
  const regexPatterns = {
    'visa': /^4/,
    'master': /^5[1-5]/,
    'amex': /^3[47]/,
    'discover': /^(6011|65|64[4-9]|622)/,
    'elo': /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|636369|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))/,
    'hipercard': /^(384100|384140|384160|606282|637095|637568|60(?!11))/
  };

  const cleanedNumber = cardNumber.replace(/\s+/g, '');

  for (const [brand, regex] of Object.entries(regexPatterns)) {
    if (regex.test(cleanedNumber)) {
      return brand;
    }
  }

  return 'unknown';
};

interface CardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cardData: Partial<CartaoType>) => Promise<void>;
  initialData?: Partial<CartaoType>;
  isLoading: boolean;
  title: string;
}

const CardFormModal: React.FC<CardFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title
}) => {
  const [formData, setFormData] = useState<Partial<CartaoType>>({
    holder_name: '',
    card_number: '',
    expiration_date: '',
    cvv: '',
    is_default: false,
    card_type: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string>('');
  const [showCVV, setShowCVV] = useState<boolean>(false);
  const isEditMode = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Se estiver editando, não mostrar o número completo do cartão
        card_number: initialData.card_number || `**** **** **** ${initialData.last_four_digits || ''}`,
      });
    } else {
      setFormData({
        holder_name: '',
        card_number: '',
        expiration_date: '',
        cvv: '',
        is_default: false,
        card_type: '',
      });
    }
    setErrors({});
  }, [initialData, open]);

  useEffect(() => {
    // Detectar o tipo do cartão quando o número mudar
    if (formData.card_number && !formData.card_number.includes('*')) {
      const cardType = detectCardType(formData.card_number);
      if (cardType !== 'unknown' && cardType !== formData.card_type) {
        setFormData(prev => ({
          ...prev,
          card_type: cardType
        }));
      }
    }
  }, [formData.card_number]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Aplicar formatação específica para cada campo
    if (name === 'card_number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiration_date') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = formatCVV(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));
    
    // Limpar erro do campo quando o usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(e.target.name);
  };

  const handleBlur = () => {
    setFocused('');
  };

  const toggleCVVVisibility = () => {
    setShowCVV(!showCVV);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.holder_name?.trim()) {
      newErrors.holder_name = 'O nome do titular é obrigatório';
    }
    
    if (!formData.card_number?.trim() || formData.card_number.includes('*')) {
      if (!isEditMode) {
        newErrors.card_number = 'O número do cartão é obrigatório';
      }
    } else if (!validateCardNumber(formData.card_number)) {
      newErrors.card_number = 'Número de cartão inválido';
    }
    
    if (!formData.expiration_date?.trim()) {
      newErrors.expiration_date = 'A data de expiração é obrigatória';
    } else {
      const [month, year] = formData.expiration_date.split('/');
      const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos do ano
      const currentMonth = new Date().getMonth() + 1; // Janeiro é 0
      
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiration_date = 'Formato inválido. Use MM/AA';
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiration_date = 'Mês inválido';
      } else if (
        (parseInt(year) < currentYear) || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiration_date = 'Cartão expirado';
      }
    }
    
    if (!formData.cvv?.trim()) {
      newErrors.cvv = 'O código de segurança é obrigatório';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    // Verificar se o tipo do cartão está definido
    if (!formData.card_type && !isEditMode) {
      // Tentar detectar o tipo do cartão
      if (formData.card_number) {
        const cardType = detectCardType(formData.card_number);
        if (cardType === 'unknown') {
          newErrors.card_number = 'Não foi possível identificar a bandeira do cartão';
        } else {
          // Atualizar o tipo do cartão
          setFormData(prev => ({
            ...prev,
            card_type: cardType
          }));
        }
      } else {
        newErrors.card_number = 'Número de cartão inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Preparar os dados para envio
      const dataToSubmit = { ...formData };
      
      // Detectar o tipo do cartão com base no número
      if (dataToSubmit.card_number && !dataToSubmit.card_type) {
        dataToSubmit.card_type = detectCardType(dataToSubmit.card_number);
      }
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      // Erros específicos são tratados no hook useUserCards
    }
  };

  // Determinar a bandeira do cartão para exibição
  const cardType = formData.card_number ? detectCardType(formData.card_number) : '';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                label="Nome do Titular"
                name="holder_name"
                value={formData.holder_name || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={!!errors.holder_name}
                helperText={errors.holder_name}
                disabled={isLoading}
                inputProps={{ maxLength: 50 }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                label="Número do Cartão"
                name="card_number"
                value={formData.card_number || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={!!errors.card_number}
                helperText={errors.card_number}
                disabled={isLoading}
                inputProps={{ maxLength: 19 }} // 16 dígitos + 3 espaços
              />
              
              <TextField
                margin="normal"
                fullWidth
                label="Data de Expiração (MM/AA)"
                name="expiration_date"
                value={formData.expiration_date || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={!!errors.expiration_date}
                helperText={errors.expiration_date}
                disabled={isLoading}
                inputProps={{ maxLength: 5 }} // MM/YY
              />
              
              <TextField
                margin="normal"
                fullWidth
                label="Código de Segurança (CVV)"
                name="cvv"
                type={showCVV ? 'text' : 'password'}
                value={formData.cvv || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={!!errors.cvv}
                helperText={errors.cvv}
                disabled={isLoading}
                inputProps={{ maxLength: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle cvv visibility"
                        onClick={toggleCVVVisibility}
                        edge="end"
                      >
                        {showCVV ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_default || false}
                    onChange={handleChange}
                    name="is_default"
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label="Definir como cartão principal"
              />
              
              {isEditMode && (
                <FormHelperText>
                  * Para segurança, o número do cartão será atualizado apenas se você inserir um novo número.
                </FormHelperText>
              )}
            </form>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Cards
              number={formData.card_number || ''}
              name={formData.holder_name || ''}
              expiry={formData.expiration_date?.replace('/', '') || ''}
              cvc={formData.cvv || ''}
              focused={focused as any}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardFormModal; 