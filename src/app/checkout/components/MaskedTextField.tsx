"use client";
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
    ({ mask, value, onChange, maskChar = '', disabled, ...textFieldProps }, ref) => {
        return (
            <InputMask
                mask={mask}
                value={value || ''}
                onChange={onChange}
                maskChar={maskChar}
                disabled={disabled}
            >
                {(inputProps: any) => (
                    <TextField
                        {...textFieldProps}
                        {...inputProps}
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

