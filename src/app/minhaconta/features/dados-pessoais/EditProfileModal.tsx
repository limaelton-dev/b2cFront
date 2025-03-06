import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { DadosPessoaisType } from '../../types';
import { useNotificationContext } from '../../context/NotificationContext';
import { formatCPF, formatDateForInput, formatDateForAPI } from '../../utils/formatters';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: DadosPessoaisType;
  onSave: (data: Partial<DadosPessoaisType>, type: 'profile' | 'user') => Promise<void>;
  loading: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  userData,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState<Partial<DadosPessoaisType>>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'user'>('profile');
  const { showError } = useNotificationContext();

  useEffect(() => {
    if (open) {
      // Inicializar o formulário com os dados atuais do usuário
      setFormData({
        full_name: userData.full_name,
        cpf: userData.cpf,
        birth_date: formatDateForInput(userData.birth_date),
        gender: userData.gender,
        username: userData.username,
        email: userData.email
      });
    }
  }, [open, userData]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Formatação especial para CPF
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validar campos obrigatórios
      if (activeTab === 'profile') {
        if (!formData.full_name?.trim()) {
          showError('Nome completo é obrigatório');
          return;
        }
        
        // Formatar data para o formato da API
        const dataToSave = {
          ...formData,
          birth_date: formData.birth_date ? formatDateForAPI(formData.birth_date as string) : undefined
        };
        
        await onSave(dataToSave, 'profile');
      } else {
        if (!formData.email?.trim()) {
          showError('E-mail é obrigatório');
          return;
        }
        
        if (!formData.username?.trim()) {
          showError('Nome de usuário é obrigatório');
          return;
        }
        
        await onSave(formData, 'user');
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ backgroundColor: '#102d57', color: 'white', fontWeight: 500 }}>
        Editar Perfil
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setActiveTab('profile')}
            sx={{ 
              mr: 2, 
              pb: 1,
              color: activeTab === 'profile' ? '#102d57' : 'text.secondary',
              borderBottom: activeTab === 'profile' ? 2 : 0,
              borderColor: '#102d57',
              borderRadius: 0
            }}
          >
            Dados Pessoais
          </Button>
          <Button 
            onClick={() => setActiveTab('user')}
            sx={{ 
              pb: 1,
              color: activeTab === 'user' ? '#102d57' : 'text.secondary',
              borderBottom: activeTab === 'user' ? 2 : 0,
              borderColor: '#102d57',
              borderRadius: 0
            }}
          >
            Dados de Usuário
          </Button>
        </Box>
        
        {activeTab === 'profile' ? (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
              Atualize seus dados pessoais
            </Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Nome Completo"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleTextFieldChange}
              required
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="CPF"
              name="cpf"
              value={formData.cpf || ''}
              onChange={handleTextFieldChange}
              inputProps={{ maxLength: 14 }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Data de Nascimento"
              name="birth_date"
              type="date"
              value={formData.birth_date || ''}
              onChange={handleTextFieldChange}
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gênero</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={formData.gender || ''}
                label="Gênero"
                onChange={handleSelectChange}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
                <MenuItem value="O">Outro</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
              Atualize seus dados de usuário
            </Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Nome de Usuário"
              name="username"
              value={formData.username || ''}
              onChange={handleTextFieldChange}
              required
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="E-mail"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleTextFieldChange}
              required
            />
          </Box>
        )}
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

export default EditProfileModal; 