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
  Typography, 
  Box,
  CircularProgress,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { EnderecoType } from '../../types';
import { useToastSide } from '@/context/ToastSideProvider';
import { fetchAddressByPostalCode } from '@/api/address/services/cep';

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  address?: EnderecoType | null;
  onSave: (data: Partial<EnderecoType>) => Promise<void>;
  loading: boolean;
}

// Lista de estados brasileiros
const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  open,
  onClose,
  address,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState<Partial<EnderecoType>>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false
  });
  
  const [searchingCEP, setSearchingCEP] = useState(false);
  const { showToast } = useToastSide();
  const isEditing = !!address;

  useEffect(() => {
    if (open && address) {
      // Inicializar o formulário com os dados do endereço existente
      setFormData({
        street: address.street || '',
        number: address.number || '',
        complement: address.complement || '',
        neighborhood: address.neighborhood || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        is_default: address.is_default || false
      });
    } else if (open) {
      // Resetar o formulário para um novo endereço
      setFormData({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        postal_code: '',
        is_default: false
      });
    }
  }, [open, address]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Para checkbox, usar o valor de checked
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Formatação especial para CEP
    if (name === 'postal_code') {
      const formattedCep = formatCEP(value);
      setFormData(prev => ({ ...prev, [name]: formattedCep }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para formatar CEP (00000-000)
  const formatCEP = (cep: string): string => {
    // Remove caracteres não numéricos
    const cepDigits = cep.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const limitedCep = cepDigits.slice(0, 8);
    
    // Aplica a máscara
    if (limitedCep.length <= 5) {
      return limitedCep;
    } else {
      return `${limitedCep.slice(0, 5)}-${limitedCep.slice(5)}`;
    }
  };

  // Função para buscar endereço pelo CEP
  const handleSearchCEP = async () => {
    const cep = formData.postal_code;
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      showToast('Digite um CEP válido com 8 dígitos.', 'error');
      return;
    }
    
    try {
      setSearchingCEP(true);
      const addressData = await fetchAddressByPostalCode(cep);
      
      setFormData(prev => ({
        ...prev,
        street: addressData.street,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state
      }));
      
      showToast('Endereço encontrado com sucesso!', 'success');
    } catch (error: any) {
      if (error.message) {
        showToast(error.message, 'error');
      } else {
        showToast('Não foi possível encontrar o endereço. Verifique o CEP e tente novamente.', 'error');
      }
    } finally {
      setSearchingCEP(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.street?.trim()) {
        showToast('Rua/Avenida é obrigatória', 'error');
        return;
      }
      
      if (!formData.number?.trim()) {
        showToast('Número é obrigatório', 'error');
        return;
      }
      
      if (!formData.neighborhood?.trim()) {
        showToast('Bairro é obrigatório', 'error');
        return;
      }
      
      if (!formData.city?.trim()) {
        showToast('Cidade é obrigatória', 'error');
        return;
      }
      
      if (!formData.state?.trim()) {
        showToast('Estado é obrigatório', 'error');
        return;
      }
      
      if (!formData.postal_code?.trim()) {
        showToast('CEP é obrigatório', 'error');
        return;
      }
      
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  // Função para limpar o formulário
  const handleClearForm = () => {
    setFormData({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      is_default: false
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ backgroundColor: '#102d57', color: 'white', fontWeight: 500 }}>
        {isEditing ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
          {isEditing 
            ? 'Atualize as informações do endereço' 
            : 'Preencha as informações do novo endereço'}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="CEP"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleTextFieldChange}
              required
              inputProps={{ maxLength: 9 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSearchCEP}
                      disabled={searchingCEP}
                      edge="end"
                    >
                      {searchingCEP ? <CircularProgress size={20} /> : <SearchIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Digite o CEP e clique na lupa para buscar o endereço"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Rua/Avenida"
              name="street"
              value={formData.street}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Número"
              name="number"
              value={formData.number}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Complemento"
              name="complement"
              value={formData.complement}
              onChange={handleTextFieldChange}
              placeholder="Apto, Bloco, etc."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Bairro"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          
          <Grid item xs={8}>
            <TextField
              fullWidth
              margin="normal"
              label="Cidade"
              name="city"
              value={formData.city}
              onChange={handleTextFieldChange}
              required
            />
          </Grid>
          
          <Grid item xs={4}>
            <TextField
              fullWidth
              margin="normal"
              select
              label="Estado"
              name="state"
              value={formData.state}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, state: e.target.value }));
              }}
              required
            >
              {ESTADOS_BRASILEIROS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.is_default} 
                  onChange={handleTextFieldChange}
                  name="is_default"
                  color="primary"
                />
              }
              label="Definir como endereço principal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleClearForm}
          color="inherit"
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Limpar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
          sx={{ 
            backgroundColor: '#102d57',
            '&:hover': {
              backgroundColor: '#0a1e3a',
            }
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressFormModal; 