'use client';

import React from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';

const THEME_COLOR = '#252d5f';

interface AuthTextFieldProps extends Omit<TextFieldProps, 'variant'> {
    icon?: React.ReactNode;
}

export default function AuthTextField({ icon, sx, ...props }: AuthTextFieldProps) {
    return (
        <TextField
            fullWidth
            variant="outlined"
            InputProps={{
                startAdornment: icon ? (
                    <InputAdornment position="start" sx={{ color: '#666' }}>
                        {icon}
                    </InputAdornment>
                ) : undefined,
            }}
            sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fafafa',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                        borderColor: THEME_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: THEME_COLOR,
                        borderWidth: 2,
                    },
                    '&.Mui-error fieldset': {
                        borderColor: '#d32f2f',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#666',
                    '&.Mui-focused': {
                        color: THEME_COLOR,
                    },
                    '&.Mui-error': {
                        color: '#d32f2f',
                    },
                },
                '& .MuiInputBase-input': {
                    py: 1.5,
                },
                ...sx,
            }}
            {...props}
        />
    );
}

