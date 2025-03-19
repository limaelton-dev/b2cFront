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
  Box,
  CircularProgress,
  SelectChangeEvent,
  Tabs,
  Tab,
  Typography,
  Divider,
} from '@mui/material';
import { formatCPF, formatDateForInput, formatDateForAPI, formatPhone } from '../../utils/formatters';
import { ProfilePF, ProfilePJ, User } from '../../../types/user';
import { Phone } from '../../../types/phones';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface EditProfileFormData {
  // Dados do usuário
  email: string;
  password: string;
  confirmPassword: string;
  
  // Dados de telefone
  phone: string;
  ddd: string;
  
  // Campos para PF
  full_name?: string;
  cpf?: string;
  birth_date?: string;
  gender?: string | null;
  
  // Campos para PJ
  company_name?: string;
  cnpj?: string;
  trading_name?: string;
  state_registration?: string;
  municipal_registration?: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: User;
  onSave: (data: Partial<User>, type: 'profile' | 'user') => Promise<void>;
  loading: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  userData,
  onSave,
  loading,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<EditProfileFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ddd: '',
  });

  useEffect(() => {
    if (open && userData) {
      const initData: EditProfileFormData = {
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        phone: userData.phone && userData.phone.length > 0 ? userData.phone[0].number : '',
        ddd: userData.phone && userData.phone.length > 0 ? userData.phone[0].ddd : '',
      };

      if (userData.profile_type === 'PF' && userData.profile) {
        const profilePF = userData.profile as ProfilePF;
        initData.full_name = profilePF.full_name || '';
        initData.cpf = profilePF.cpf || '';
        initData.birth_date = profilePF.birth_date ? formatDateForInput(profilePF.birth_date) : '';
        initData.gender = profilePF.gender || '';
      } else if (userData.profile_type === 'PJ' && userData.profile) {
        const profilePJ = userData.profile as ProfilePJ;
        initData.company_name = profilePJ.company_name || '';
        initData.cnpj = profilePJ.cnpj || '';
        initData.trading_name = profilePJ.trading_name || '';
        initData.state_registration = profilePJ.state_registration || '';
        initData.municipal_registration = profilePJ.municipal_registration || '';
      }
      setFormData(initData);
    }
  }, [open, userData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplicar formatações específicas
    if (name === 'cpf') {
      setFormData((prev) => ({ ...prev, [name]: formatCPF(value) }));
      return;
    }
    
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value).replace(/\D/g, '') }));
      // Extrair DDD do telefone formatado
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length >= 2) {
        setFormData((prev) => ({ ...prev, ddd: phoneDigits.substring(0, 2) }));
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfileData = (): boolean => {
    if (userData.profile_type === 'PF') {
      if (!formData.full_name?.trim()) {
        alert('Nome completo é obrigatório');
        return false;
      }
      if (!formData.cpf?.trim()) {
        alert('CPF é obrigatório');
        return false;
      }
    } else if (userData.profile_type === 'PJ') {
      if (!formData.company_name?.trim()) {
        alert('Nome da empresa é obrigatório');
        return false;
      }
      if (!formData.cnpj?.trim()) {
        alert('CNPJ é obrigatório');
        return false;
      }
    }
    
    if (!formData.phone?.trim()) {
      alert('Telefone é obrigatório');
      return false;
    }
    
    return true;
  };

  const validateUserData = (): boolean => {
    if (!formData.email?.trim()) {
      alert('E-mail é obrigatório');
      return false;
    }
    
    // Validar senha apenas se o usuário estiver tentando alterá-la
    if (formData.password) {
      if (formData.password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem');
        return false;
      }
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileData()) return;
    
    const formattedData = { ...formData };
    if (formattedData.birth_date) {
      formattedData.birth_date = formatDateForAPI(formattedData.birth_date);
    }
    
    // Preparar o objeto de telefone
    const phoneObj: Phone = {
      id: userData.phone && userData.phone.length > 0 ? userData.phone[0].id : 0,
      number: formattedData.phone,
      ddd: formattedData.ddd || '11', // Valor padrão caso não tenha sido extraído
      is_default: true,
      verified: userData.phone && userData.phone.length > 0 ? userData.phone[0].verified : false
    };
    
    // Monta o objeto final a ser salvo para o perfil
    const dataToSave: Partial<User> = {
      phone: [phoneObj],
    };

    // Adicionar os campos específicos do perfil
    if (userData.profile_type === 'PF') {
      const profileData: ProfilePF = {
        profile_id: (userData.profile as ProfilePF)?.profile_id || 0,
        full_name: formattedData.full_name || '',
        cpf: formattedData.cpf || '',
        birth_date: formattedData.birth_date || '',
        gender: formattedData.gender
      };
      dataToSave.profile = profileData;
    } else if (userData.profile_type === 'PJ') {
      const profileData: ProfilePJ = {
        profile_id: (userData.profile as ProfilePJ)?.profile_id || 0,
        company_name: formattedData.company_name || '',
        cnpj: formattedData.cnpj || '',
        trading_name: formattedData.trading_name || '',
        state_registration: formattedData.state_registration || '',
        municipal_registration: formattedData.municipal_registration || ''
      };
      dataToSave.profile = profileData;
    }

    try {
      await onSave(dataToSave, 'profile');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  };

  const handleSaveUser = async () => {
    if (!validateUserData()) return;
    
    // Monta o objeto final a ser salvo para o usuário
    const dataToSave: Partial<User> = {
      email: formData.email,
    };
    
    // Adiciona a senha apenas se foi preenchida
    if (formData.password) {
      dataToSave.password = formData.password;
    }

    try {
      await onSave(dataToSave, 'user');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  const handleSubmit = async () => {
    if (tabValue === 0) {
      await handleSaveProfile();
    } else {
      await handleSaveUser();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: '#102d57', color: 'white', fontWeight: 500 }}>
        Editar Dados
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="edit tabs" centered>
          <Tab label="Dados Pessoais" />
          <Tab label="Dados do Usuário" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Box component="form" noValidate>
            {userData.profile_type === 'PF' ? (
              <>
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
                  required
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
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nome da Empresa"
                  name="company_name"
                  value={formData.company_name || ''}
                  onChange={handleTextFieldChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj || ''}
                  onChange={handleTextFieldChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nome Fantasia"
                  name="trading_name"
                  value={formData.trading_name || ''}
                  onChange={handleTextFieldChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Inscrição Estadual"
                  name="state_registration"
                  value={formData.state_registration || ''}
                  onChange={handleTextFieldChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Inscrição Municipal"
                  name="municipal_registration"
                  value={formData.municipal_registration || ''}
                  onChange={handleTextFieldChange}
                />
              </>
            )}
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Telefone
            </Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleTextFieldChange}
              required
              helperText="Formato: (XX) XXXXX-XXXX"
            />
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box component="form" noValidate>
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
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Alterar Senha (deixe em branco para manter a atual)
            </Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Nova Senha"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleTextFieldChange}
              helperText="Mínimo de 6 caracteres"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirmar Nova Senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword || ''}
              onChange={handleTextFieldChange}
            />
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            backgroundColor: '#102d57',
            '&:hover': {
              backgroundColor: '#0a1e3a',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
