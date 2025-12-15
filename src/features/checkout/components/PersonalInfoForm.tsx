'use client';

import React from 'react';
import Link from 'next/link';
import {
    Box,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    CircularProgress,
    Checkbox,
    Typography,
} from '@mui/material';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData, PROFILE_TYPE } from '../hooks/useCheckoutCustomer';
import { THEME_COLOR, checkoutStyles } from '../theme';

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

export default function PersonalInfoForm({
    formData,
    errors,
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
    onContinue,
}: PersonalInfoFormProps) {
    return (
        <Box component="form" sx={{ position: 'relative', width: '100%' }}>
            {loadingPersonalData && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                    }}
                >
                    <CircularProgress sx={{ color: THEME_COLOR }} />
                </Box>
            )}

            <Box sx={{ filter: loadingPersonalData ? 'blur(2px)' : 'none', width: '100%' }}>
                {!isAuthenticated && (
                    <RadioGroup
                        row
                        value={formData.profileType}
                        aria-labelledby="profile-type-radio-group"
                        name="profile-type-radio-group"
                        sx={{ justifyContent: 'space-between', width: '100%', mb: 2 }}
                    >
                        <FormControlLabel
                            value={PROFILE_TYPE.PF}
                            control={<Radio sx={checkoutStyles.checkbox} />}
                            onClick={() => onChangeProfileType(PROFILE_TYPE.PF)}
                            label="Pessoa Física"
                            sx={{ m: 0 }}
                        />
                        <FormControlLabel
                            value={PROFILE_TYPE.PJ}
                            control={<Radio sx={checkoutStyles.checkbox} />}
                            onClick={() => onChangeProfileType(PROFILE_TYPE.PJ)}
                            label="Pessoa Jurídica"
                            sx={{ m: 0 }}
                        />
                    </RadioGroup>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome *"
                            value={formData.firstName}
                            onChange={(e) => onUpdateField('firstName', e.target.value)}
                            size="small"
                            sx={checkoutStyles.textField}
                        />
                        <TextField
                            fullWidth
                            label="Sobrenome *"
                            value={formData.lastName}
                            onChange={(e) => onUpdateField('lastName', e.target.value)}
                            size="small"
                            sx={checkoutStyles.textField}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Email *"
                        value={formData.email}
                        onChange={(e) => onUpdateField('email', e.target.value)}
                        onBlur={onValidateEmail}
                        disabled={isAuthenticated}
                        error={errors.email}
                        helperText={errors.email ? errors.emailMessage : ''}
                        size="small"
                        sx={checkoutStyles.textField}
                    />

                    {!isAuthenticated && (
                        <>
                            <TextField
                                fullWidth
                                type="password"
                                label="Senha *"
                                value={formData.password}
                                onChange={(e) => onUpdateField('password', e.target.value)}
                                onBlur={onValidatePasswords}
                                error={errors.passwords}
                                helperText={errors.passwords ? errors.passwordsMessage : ''}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirmar Senha *"
                                value={formData.confirmPassword}
                                onChange={(e) => onUpdateField('confirmPassword', e.target.value)}
                                onBlur={onValidatePasswords}
                                error={errors.passwords}
                                helperText={errors.passwords ? errors.passwordsMessage : ''}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                        </>
                    )}

                    <MaskedTextField
                        mask="(99) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => onUpdateField('phone', e.target.value)}
                        onBlur={() => onValidatePhone(formData.phone)}
                        label="Telefone fixo ou Celular *"
                        error={errors.phone}
                        helperText={errors.phone ? errors.phoneMessage : ''}
                        size="small"
                        fullWidth
                        sx={checkoutStyles.textField}
                    />

                    {formData.profileType === PROFILE_TYPE.PJ && (
                        <>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <MaskedTextField
                                    mask="99.999.999/9999-99"
                                    value={formData.cnpj}
                                    onChange={(e) => onUpdateField('cnpj', e.target.value)}
                                    onBlur={() => onValidateCNPJ(formData.cnpj)}
                                    disabled={isAuthenticated}
                                    label="CNPJ *"
                                    error={errors.cnpj}
                                    helperText={errors.cnpj ? errors.cnpjMessage : ''}
                                    size="small"
                                    fullWidth
                                    sx={checkoutStyles.textField}
                                />
                                <TextField
                                    fullWidth
                                    label="Inscrição Estadual *"
                                    value={formData.stateRegistration}
                                    onChange={(e) => onUpdateField('stateRegistration', e.target.value)}
                                    size="small"
                                    sx={checkoutStyles.textField}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Razão Social *"
                                value={formData.tradingName}
                                onChange={(e) => onUpdateField('tradingName', e.target.value)}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                        </>
                    )}

                    {formData.profileType === PROFILE_TYPE.PF && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <MaskedTextField
                                mask="999.999.999-99"
                                value={formData.cpf}
                                onChange={(e) => onUpdateField('cpf', e.target.value)}
                                onBlur={() => onValidateCPF(formData.cpf)}
                                disabled={isAuthenticated}
                                label="CPF *"
                                error={errors.cpf}
                                helperText={errors.cpf ? errors.cpfMessage : ''}
                                size="small"
                                fullWidth
                                sx={checkoutStyles.textField}
                            />
                            <MaskedTextField
                                mask="99/99/9999"
                                value={formData.birthDate}
                                onChange={(e) => onUpdateField('birthDate', e.target.value)}
                                onBlur={() => onValidateBirthDate(formData.birthDate)}
                                label="Data de Nascimento *"
                                placeholder="DD/MM/AAAA"
                                error={errors.birthDate}
                                helperText={errors.birthDate ? errors.birthDateMessage : ''}
                                size="small"
                                fullWidth
                                sx={checkoutStyles.textField}
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 2, mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.receiveOffers}
                                onChange={(e) => onUpdateField('receiveOffers', e.target.checked)}
                                sx={checkoutStyles.checkbox}
                                size="small"
                            />
                        }
                        label={<Typography variant="body2">Quero receber ofertas futuras</Typography>}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.acceptPrivacyPolicy}
                                onChange={(e) => onUpdateField('acceptPrivacyPolicy', e.target.checked)}
                                sx={checkoutStyles.checkbox}
                                size="small"
                            />
                        }
                        label={
                            <Typography variant="body2">
                                Aceito a{' '}
                                <Link
                                    href="/politica-privacidade"
                                    style={{ color: THEME_COLOR, fontWeight: 500 }}
                                >
                                    Política de Privacidade
                                </Link>
                            </Typography>
                        }
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onContinue}
                    sx={checkoutStyles.button}
                >
                    Continuar
                </Button>
            </Box>
        </Box>
    );
}
