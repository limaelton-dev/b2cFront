"use client";
import React from 'react';
import { Box, TextField, RadioGroup, FormControlLabel, Radio, Typography, Button, CircularProgress, Link as MuiLink } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import ReactInputMask from 'react-input-mask';
import { CheckoutFormData, FormErrors } from '../hooks/useCheckoutForm';

interface PersonalInfoFormProps {
    formData: CheckoutFormData;
    errors: FormErrors;
    disabledFields: {
        user: boolean;
        personalPF: boolean;
        personalPJ: boolean;
    };
    isAuthenticated: boolean;
    loadingPersonalData: boolean;
    onChangeProfileType: (value: string) => void;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onValidateCPF: (cpf: string) => void;
    onValidateEmail: () => void;
    onValidatePhone: (phone: string) => void;
    onContinue: () => void;
}

/**
 * Componente para o formulário de dados pessoais no checkout
 */
const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    formData,
    errors,
    disabledFields,
    isAuthenticated,
    loadingPersonalData,
    onChangeProfileType,
    onUpdateField,
    onValidateCPF,
    onValidateEmail,
    onValidatePhone,
    onContinue
}) => {
    return (
        <form className="d-flex justify-content-between flex-wrap" style={{position: 'relative'}}>
            {loadingPersonalData ? (
                <Box sx={{ 
                    position: 'absolute', 
                    top: '40%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    zIndex: '99999'
                }}>
                    <CircularProgress />
                </Box>
            ) : null}
            
            <Box className="d-flex justify-content-between flex-wrap" 
                 sx={{filter: loadingPersonalData ? 'blur(2px)' : 'blur:(0px)', width: '100%'}}>
                <RadioGroup
                    row
                    value={formData.profileType}
                    aria-labelledby="profile-type-radio-group"
                    name="profile-type-radio-group"
                    sx={{justifyContent: 'space-between', width: '100%'}}
                >
                    <FormControlLabel 
                        value="1" 
                        sx={{margin: '0px'}} 
                        control={<Radio disabled={isAuthenticated} />} 
                        onClick={() => onChangeProfileType('1')} 
                        label="Pessoa Física" 
                    />
                    <FormControlLabel 
                        value="2" 
                        sx={{margin: '0px'}} 
                        control={<Radio disabled={isAuthenticated} />} 
                        onClick={() => onChangeProfileType('2')} 
                        label="Pessoa Jurídica" 
                    />
                </RadioGroup>
                
                <TextField 
                    sx={{width: '100%', marginBottom: '12px'}} 
                    onChange={(e) => onUpdateField('name', e.target.value)} 
                    value={formData.name} 
                    disabled={disabledFields.user} 
                    label="Nome Completo*" 
                    variant="standard" 
                />
                
                <TextField 
                    sx={{width: '100%', marginBottom: '12px'}} 
                    onChange={(e) => onUpdateField('email', e.target.value)} 
                    error={errors.email} 
                    value={formData.email} 
                    disabled={disabledFields.user} 
                    onBlur={onValidateEmail} 
                    helperText={errors.email ? "Email já cadastrado" : ''} 
                    label="Email*" 
                    variant="standard" 
                />
                
                {!isAuthenticated && (
                    <>
                        <TextField 
                            sx={{width: '100%', marginBottom: '12px'}} 
                            onChange={(e) => onUpdateField('password', e.target.value)} 
                            value={formData.password} 
                            type="password"
                            label="Senha*" 
                            variant="standard" 
                            error={errors.passwords}
                            helperText={errors.passwords ? errors.passwordsMessage : ''}
                        />
                        <TextField 
                            sx={{width: '100%', marginBottom: '12px'}} 
                            onChange={(e) => onUpdateField('confirmPassword', e.target.value)} 
                            value={formData.confirmPassword} 
                            type="password"
                            label="Confirmar Senha*" 
                            variant="standard" 
                            error={errors.passwords}
                            helperText={errors.passwords ? errors.passwordsMessage : ''}
                        />
                    </>
                )}
                
                <ReactInputMask
                    mask="(99) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => onUpdateField('phone', e.target.value)}
                    onBlur={() => onValidatePhone(formData.phone)}
                    maskChar=""
                    disabled={isAuthenticated}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            label="Telefone fixo ou Celular*"
                            variant="standard"
                            error={errors.phone}
                            helperText={errors.phone ? errors.phoneMessage : ''}
                            sx={{
                                '& .MuiInputBase-input::placeholder': {
                                    fontSize: '23px', 
                                    fontWeight: 'bold',
                                },
                                width: '100%',  
                                marginBottom: '8px'
                            }}
                        />
                    )}
                </ReactInputMask>
                
                {formData.profileType === '2' && (
                    <>
                        <ReactInputMask
                            mask="99.999.999/9999-99"
                            value={formData.cnpj}
                            onChange={(e) => onUpdateField('cnpj', e.target.value)}
                            disabled={disabledFields.personalPJ}
                            maskChar=""
                        >
                            {(inputProps) => (
                                <TextField
                                    {...inputProps}
                                    label="CNPJ*"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '23px', 
                                            fontWeight: 'bold',
                                        },
                                        width: '45%',  
                                        marginBottom: '8px'
                                    }}
                                />
                            )}
                        </ReactInputMask>
                        <TextField 
                            sx={{width: '45%', marginBottom: '12px'}} 
                            value={formData.stateRegistration} 
                            onChange={(e) => onUpdateField('stateRegistration', e.target.value)} 
                            disabled={disabledFields.personalPJ} 
                            label="Inscrição Estadual*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '100%', marginBottom: '12px'}} 
                            value={formData.tradingName} 
                            onChange={(e) => onUpdateField('tradingName', e.target.value)} 
                            disabled={disabledFields.personalPJ} 
                            label="Razão Social*" 
                            variant="standard" 
                        />
                    </>
                )}
                
                {formData.profileType === '1' && (
                    <>
                        <ReactInputMask
                            mask="999.999.999-99"
                            value={formData.cpf}
                            onChange={(e) => onUpdateField('cpf', e.target.value)}
                            onBlur={() => onValidateCPF(formData.cpf)}
                            disabled={disabledFields.personalPF}
                            maskChar=""
                        >
                            {(inputProps) => (
                                <TextField
                                    {...inputProps}
                                    label="CPF*"
                                    error={errors.cpf}
                                    helperText={errors.cpf ? "Cpf inválido ou já cadastrado" : ''}
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '23px', 
                                            fontWeight: 'bold',
                                        },
                                        width: '100%',  
                                        marginBottom: '8px'
                                    }}
                                />
                            )}
                        </ReactInputMask>
                    </>
                )}
                
                <div className='mb-3 mt-3'>
                    <Checkbox 
                        sx={{'& .MuiCheckbox-label': {zIndex: '55'}}} 
                        label={<>Quero receber ofertas futuras</>}
                        checked={formData.receiveOffers}
                        onChange={(e) => onUpdateField('receiveOffers', e.target.checked)}
                    />
                    <Checkbox 
                        sx={{'& .MuiCheckbox-label': {zIndex: '55'}}} 
                        label={<>Aceito a <MuiLink sx={{color: 'blue'}} href="/politica-privacidade">Política de Privacidade</MuiLink></>}
                        checked={formData.acceptPrivacyPolicy}
                        onChange={(e) => onUpdateField('acceptPrivacyPolicy', e.target.checked)}
                    />
                </div>
                
                <Button 
                    variant="contained" 
                    color="primary"
                    className='mb-3'
                    fullWidth 
                    onClick={onContinue}
                >
                    Continuar
                </Button>
            </Box>
        </form>
    );
};

export default PersonalInfoForm; 