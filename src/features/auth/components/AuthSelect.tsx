'use client';

import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    SelectProps,
    Box,
} from '@mui/material';

const THEME_COLOR = '#252d5f';

interface SelectOption {
    value: string;
    label: string;
}

interface AuthSelectProps extends Omit<SelectProps, 'variant'> {
    icon?: React.ReactNode;
    options: SelectOption[];
}

export default function AuthSelect({ icon, options, label, sx, ...props }: AuthSelectProps) {
    return (
        <FormControl
            fullWidth
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
                },
                '& .MuiInputLabel-root': {
                    color: '#666',
                    '&.Mui-focused': {
                        color: THEME_COLOR,
                    },
                },
                ...sx,
            }}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                startAdornment={
                    icon ? (
                        <InputAdornment position="start" sx={{ color: '#666', ml: 0.5 }}>
                            {icon}
                        </InputAdornment>
                    ) : undefined
                }
                sx={{
                    '& .MuiSelect-select': {
                        py: 1.5,
                        pl: icon ? 1 : 1.75,
                    },
                }}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

