'use client';

import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

const THEME_COLOR = '#252d5f';

type ProfileType = 'PF' | 'PJ';

interface ProfileTypeSelectorProps {
    value: ProfileType;
    onChange: (type: ProfileType) => void;
}

export default function ProfileTypeSelector({ value, onChange }: ProfileTypeSelectorProps) {
    const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: ProfileType | null) => {
        if (newValue) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleChange}
                sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    p: 0.5,
                    '& .MuiToggleButton-root': {
                        border: 'none',
                        borderRadius: 1.5,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        color: '#666',
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                            bgcolor: THEME_COLOR,
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(37, 45, 95, 0.3)',
                            '&:hover': {
                                bgcolor: THEME_COLOR,
                            },
                        },
                        '&:hover': {
                            bgcolor: 'rgba(37, 45, 95, 0.08)',
                        },
                    },
                }}
            >
                <ToggleButton value="PF">
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    Pessoa Física
                </ToggleButton>
                <ToggleButton value="PJ">
                    <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
                    Pessoa Jurídica
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

