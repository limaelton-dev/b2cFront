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
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Box
} from '@mui/material';
import { CartaoType } from '../../types';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';

const CARD_BRANDS = [
  { value: 'visa', label: 'Visa' },
  { value: 'master', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'elo', label: 'Elo' },
  { value: 'hipercard', label: 'Hipercard' },
  { value: 'discover', label: 'Discover' },
];

const formatLastFourDigits = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 4);
};

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) {
    return `${v.slice(0, 2)}/${v.slice(2)}`;
  }
  return v;
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
  const [formData, setFormData] = useState<Partial<CartaoType> & { expiration_date?: string }>({
    holder_name: '',
    last_four_digits: '',
    expiration_date: '',
    card_type: '',
    is_default: false,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = !!initialData?.id;

  useEffect(() => {
    if (initialData) {
      const expirationDisplay = initialData.expiration_month && initialData.expiration_year
        ? `${initialData.expiration_month}/${initialData.expiration_year.slice(-2)}`
        : '';
      
      setFormData({
        ...initialData,
        expiration_date: expirationDisplay,
      });
    } else {
      setFormData({
        holder_name: '',
        last_four_digits: '',
        expiration_date: '',
        card_type: '',
        is_default: false,
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    let formattedValue = value as string;
    
    if (name === 'last_four_digits') {
      formattedValue = formatLastFourDigits(value as string);
    } else if (name === 'expiration_date') {
      formattedValue = formatExpiryDate(value as string);
    }
    
    setFormData(prev => ({
      ...prev,
      [name!]: type === 'checkbox' ? checked : formattedValue
    }));
    
    if (errors[name!]) {
      setErrors(prev => ({ ...prev, [name!]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.holder_name?.trim()) {
      newErrors.holder_name = 'O nome do titular é obrigatório';
    }
    
    if (!formData.last_four_digits?.trim()) {
      newErrors.last_four_digits = 'Os últimos 4 dígitos são obrigatórios';
    } else if (formData.last_four_digits.length !== 4) {
      newErrors.last_four_digits = 'Informe exatamente 4 dígitos';
    }
    
    if (!formData.expiration_date?.trim()) {
      newErrors.expiration_date = 'A data de expiração é obrigatória';
    } else {
      const [month, year] = formData.expiration_date.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiration_date = 'Formato inválido. Use MM/AA';
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiration_date = 'Mês inválido';
      }
    }
    
    if (!formData.card_type) {
      newErrors.card_type = 'Selecione a bandeira do cartão';
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
      const dataToSubmit: Partial<CartaoType> = { ...formData };
      
      if (formData.expiration_date) {
        const [month, year] = formData.expiration_date.split('/');
        dataToSubmit.expiration_month = month;
        dataToSubmit.expiration_year = year.length === 2 ? `20${year}` : year;
      }
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCardIcon color="primary" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Alert 
          severity="info" 
          icon={<SecurityIcon />}
          sx={{ mb: 3, mt: 1 }}
        >
          Para sua segurança, não armazenamos o número completo do cartão nem o código de segurança (CVV). 
          Apenas os últimos 4 dígitos são salvos para identificação.
        </Alert>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                label="Nome do Titular"
                name="holder_name"
                value={formData.holder_name || ''}
                onChange={handleChange}
                error={!!errors.holder_name}
                helperText={errors.holder_name}
                disabled={isLoading}
                inputProps={{ maxLength: 50 }}
                placeholder="Nome como está no cartão"
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Últimos 4 Dígitos"
                  name="last_four_digits"
                  value={formData.last_four_digits || ''}
                  onChange={handleChange}
                  error={!!errors.last_four_digits}
                  helperText={errors.last_four_digits || 'Ex: 1234'}
                  disabled={isLoading || isEditMode}
                  inputProps={{ maxLength: 4, inputMode: 'numeric' }}
                  placeholder="1234"
                />
                
                <TextField
                  fullWidth
                  label="Validade (MM/AA)"
                  name="expiration_date"
                  value={formData.expiration_date || ''}
                  onChange={handleChange}
                  error={!!errors.expiration_date}
                  helperText={errors.expiration_date}
                  disabled={isLoading}
                  inputProps={{ maxLength: 5 }}
                  placeholder="12/28"
                />
              </Box>
              
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors.card_type}
                disabled={isLoading}
              >
                <InputLabel>Bandeira</InputLabel>
                <Select
                  name="card_type"
                  value={formData.card_type || ''}
                  label="Bandeira"
                  onChange={(e) => handleChange(e as any)}
                >
                  {CARD_BRANDS.map((brand) => (
                    <MenuItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.card_type && (
                  <FormHelperText>{errors.card_type}</FormHelperText>
                )}
              </FormControl>
              
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
                sx={{ mt: 1 }}
              />
            </form>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
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
