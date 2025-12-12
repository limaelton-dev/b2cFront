"use client";
import React from 'react';
import { Box, TextField, RadioGroup, FormControlLabel, Radio, Button, CircularProgress, Link as MuiLink } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData, PROFILE_TYPE } from '../hooks/useCheckoutCustomer';

interface FormErrors {
    cpf: boolean;
    cpfMessage: string;
    cnpj: boolean;
    cnpjMessage: string;
    email: boolean;
    emailMessage: string;
    phone: boolean;
    phoneMessage: string;
    passwords: boolean;
    passwordsMessage: string;
    birthDate: boolean;
    birthDateMessage: string;
    address: {
        postalCode: boolean;
        street: boolean;
        number: boolean;
        neighborhood: boolean;
        city: boolean;
        state: boolean;
    };
}

interface PersonalInfoFormProps {
    formData: CheckoutFormData;
    errors: FormErrors;
    disabledFields: { user: boolean; personalPF: boolean; personalPJ: boolean };
    isAuthenticated: boolean;
    loadingPersonalData: boolean;
    onChangeProfileType: (value: string) => void;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onValidateCPF: (cpf: string) => void;
    onValidateCNPJ: (cnpj: string) => void;
    onValidateEmail: () => void;
    onValidatePhone: (phone: string) => void;
    onValidatePasswords: () => void;
    onValidateBirthDate: (birthDate: string) => void;
    onContinue: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    formData,
    errors,
    disabledFields,
    isAuthenticated,
    loadingPersonalData,
    onChangeProfileType,
    onUpdateField,
    onValidateCPF,
    onValidateCNPJ,
    onValidateEmail,
    onValidatePhone,
    onValidatePasswords,
    onValidateBirthDate,
    onContinue
}) => {
    return (
        <form className="d-flex justify-content-between flex-wrap" style={{ position: 'relative' }}>
            {loadingPersonalData && (
                <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
                    <CircularProgress />
                </Box>
            )}
            
            <Box className="d-flex justify-content-between flex-wrap" sx={{ filter: loadingPersonalData ? 'blur(2px)' : 'none', width: '100%' }}>
                <RadioGroup
                    row
                    value={formData.profileType}
                    aria-labelledby="profile-type-radio-group"
                    name="profile-type-radio-group"
                    sx={{ justifyContent: 'space-between', width: '100%' }}
                >
                    <FormControlLabel 
                        value={PROFILE_TYPE.PF}
                        sx={{ margin: 0 }} 
                        control={<Radio disabled={isAuthenticated} />} 
                        onClick={() => onChangeProfileType(PROFILE_TYPE.PF)} 
                        label="Pessoa Física" 
                    />
                    <FormControlLabel 
                        value={PROFILE_TYPE.PJ}
                        sx={{ margin: 0 }} 
                        control={<Radio disabled={isAuthenticated} />} 
                        onClick={() => onChangeProfileType(PROFILE_TYPE.PJ)} 
                        label="Pessoa Jurídica" 
                    />
                </RadioGroup>
                
                <TextField 
                    sx={{ width: '48%', mb: '12px' }} 
                    onChange={(e) => onUpdateField('firstName', e.target.value)} 
                    value={formData.firstName} 
                    disabled={disabledFields.user} 
                    label="Nome*" 
                    variant="standard" 
                />
                <TextField 
                    sx={{ width: '48%', mb: '12px' }} 
                    onChange={(e) => onUpdateField('lastName', e.target.value)} 
                    value={formData.lastName} 
                    disabled={disabledFields.user} 
                    label="Sobrenome*" 
                    variant="standard" 
                />
                
                <TextField 
                    sx={{ width: '100%', mb: '12px' }} 
                    onChange={(e) => onUpdateField('email', e.target.value)} 
                    error={errors.email} 
                    value={formData.email} 
                    disabled={disabledFields.user} 
                    onBlur={onValidateEmail} 
                    helperText={errors.email ? errors.emailMessage : ''} 
                    label="Email*" 
                    variant="standard" 
                />
                
                {!isAuthenticated && (
                    <>
                        <TextField 
                            sx={{ width: '100%', mb: '12px' }} 
                            onChange={(e) => onUpdateField('password', e.target.value)} 
                            value={formData.password} 
                            type="password"
                            label="Senha*" 
                            variant="standard" 
                            error={errors.passwords}
                            helperText={errors.passwords ? errors.passwordsMessage : ''}
                            onBlur={onValidatePasswords}
                        />
                        <TextField 
                            sx={{ width: '100%', mb: '12px' }} 
                            onChange={(e) => onUpdateField('confirmPassword', e.target.value)} 
                            value={formData.confirmPassword} 
                            type="password"
                            label="Confirmar Senha*" 
                            variant="standard" 
                            error={errors.passwords}
                            helperText={errors.passwords ? errors.passwordsMessage : ''}
                            onBlur={onValidatePasswords}
                        />
                    </>
                )}
                
                <MaskedTextField
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => onUpdateField('phone', e.target.value)}
                    onBlur={() => onValidatePhone(formData.phone)}
                    disabled={isAuthenticated}
                    label="Telefone fixo ou Celular*"
                    variant="standard"
                    error={errors.phone}
                    helperText={errors.phone ? errors.phoneMessage : ''}
                    sx={{ width: '100%', mb: '8px' }}
                />
                
                {formData.profileType === PROFILE_TYPE.PJ && (
                    <>
                        <MaskedTextField
                            mask="99.999.999/9999-99"
                            value={formData.cnpj}
                            onChange={(e) => onUpdateField('cnpj', e.target.value)}
                            onBlur={() => onValidateCNPJ(formData.cnpj)}
                            disabled={disabledFields.personalPJ}
                            label="CNPJ*"
                            variant="standard"
                            error={errors.cnpj}
                            helperText={errors.cnpj ? errors.cnpjMessage : ''}
                            sx={{ width: '45%', mb: '8px' }}
                        />
                        <TextField 
                            sx={{ width: '45%', mb: '12px' }} 
                            value={formData.stateRegistration} 
                            onChange={(e) => onUpdateField('stateRegistration', e.target.value)} 
                            disabled={disabledFields.personalPJ} 
                            label="Inscrição Estadual*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{ width: '100%', mb: '12px' }} 
                            value={formData.tradingName} 
                            onChange={(e) => onUpdateField('tradingName', e.target.value)} 
                            disabled={disabledFields.personalPJ} 
                            label="Razão Social*" 
                            variant="standard" 
                        />
                    </>
                )}
                
                {formData.profileType === PROFILE_TYPE.PF && (
                    <>
                        <MaskedTextField
                            mask="999.999.999-99"
                            value={formData.cpf}
                            onChange={(e) => onUpdateField('cpf', e.target.value)}
                            onBlur={() => onValidateCPF(formData.cpf)}
                            disabled={disabledFields.personalPF}
                            label="CPF*"
                            error={errors.cpf}
                            helperText={errors.cpf ? errors.cpfMessage : ''}
                            variant="standard"
                            sx={{ width: '48%', mb: '8px' }}
                        />
                        {!isAuthenticated && (
                            <MaskedTextField
                                mask="99/99/9999"
                                value={formData.birthDate}
                                onChange={(e) => onUpdateField('birthDate', e.target.value)}
                                onBlur={() => onValidateBirthDate(formData.birthDate)}
                                label="Data de Nascimento*"
                                variant="standard"
                                placeholder="DD/MM/AAAA"
                                error={errors.birthDate}
                                helperText={errors.birthDate ? errors.birthDateMessage : ''}
                                sx={{ width: '48%', mb: '8px' }}
                            />
                        )}
                    </>
                )}
                
                <div className='mb-3 mt-3'>
                    <Checkbox 
                        sx={{ '& .MuiCheckbox-label': { zIndex: 55 } }} 
                        label="Quero receber ofertas futuras"
                        checked={formData.receiveOffers}
                        onChange={(e) => onUpdateField('receiveOffers', e.target.checked)}
                    />
                    <Checkbox 
                        sx={{ '& .MuiCheckbox-label': { zIndex: 55 } }} 
                        label={<>Aceito a <MuiLink sx={{ color: 'blue' }} href="/politica-privacidade">Política de Privacidade</MuiLink></>}
                        checked={formData.acceptPrivacyPolicy}
                        onChange={(e) => onUpdateField('acceptPrivacyPolicy', e.target.checked)}
                    />
                </div>
                
                <Button variant="contained" color="primary" className='mb-3' fullWidth onClick={onContinue}>
                    Continuar
                </Button>
            </Box>
        </form>
    );
};

export default PersonalInfoForm;

