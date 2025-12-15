'use client';

import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import InputMask from 'react-input-mask';

interface MaskedTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
    mask: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maskChar?: string;
}

const MaskedTextField = forwardRef<HTMLInputElement, MaskedTextFieldProps>(
    ({ mask, value, onChange, maskChar = '', disabled, onBlur, onFocus, variant = 'outlined', ...textFieldProps }, ref) => {
        return (
            <InputMask
                mask={mask}
                value={value || ''}
                onChange={onChange}
                maskChar={maskChar}
                disabled={disabled}
                onBlur={onBlur}
                onFocus={onFocus}
            >
                {(inputProps: any) => (
                    <TextField
                        {...textFieldProps}
                        {...inputProps}
                        variant={variant}
                        disabled={disabled}
                        inputRef={ref}
                        InputLabelProps={{ shrink: !!value }}
                    />
                )}
            </InputMask>
        );
    }
);

MaskedTextField.displayName = 'MaskedTextField';

export default MaskedTextField;

