'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { THEME_COLOR, THEME_COLOR_LIGHT } from '../theme';

interface CheckoutStepSectionProps {
    title: string;
    stepNumber: number;
    currentStep: number;
    icon: React.ReactNode;
    onStepClick: (step: number) => void;
    children: React.ReactNode;
}

export default function CheckoutStepSection({
    title,
    stepNumber,
    currentStep,
    icon,
    onStepClick,
    children,
}: CheckoutStepSectionProps) {
    const isActive = currentStep === stepNumber;
    const isEditable = stepNumber !== 3;

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 'auto', md: 400 },
                borderRadius: 2,
                border: '1px solid #e8e8e8',
                overflow: 'hidden',
            }}
        >
            <Box
                onClick={() => onStepClick(stepNumber)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? THEME_COLOR : 'transparent',
                    bgcolor: isActive ? THEME_COLOR_LIGHT : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: THEME_COLOR_LIGHT,
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: isActive ? THEME_COLOR : '#e0e0e0',
                        color: isActive ? '#fff' : '#666',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {stepNumber}
                </Box>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: isActive ? THEME_COLOR : '#666',
                        transition: 'color 0.3s ease',
                    }}
                >
                    {title}
                </Typography>
                {!isActive && isEditable && (
                    <Typography
                        variant="caption"
                        sx={{ color: '#999', ml: 0.5 }}
                    >
                        (clique para editar)
                    </Typography>
                )}
            </Box>

            <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!isActive && (
                    <Box
                        onClick={() => onStepClick(stepNumber)}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            bgcolor: '#fff',
                            p: 2,
                            border: `3px solid ${THEME_COLOR}`,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                boxShadow: `0 0 12px 2px rgba(37, 45, 95, 0.3)`,
                                transform: 'translate(-50%, -50%) scale(1.05)',
                            },
                            '& svg': {
                                fontSize: 40,
                                color: THEME_COLOR,
                            },
                        }}
                        aria-label={`Editar ${title}`}
                    >
                        {icon}
                    </Box>
                )}

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        transition: 'all 0.3s ease',
                        filter: isActive ? 'none' : 'blur(3px)',
                        opacity: isActive ? 1 : 0.25,
                        pointerEvents: isActive ? 'auto' : 'none',
                        minHeight: isActive ? 'auto' : { xs: 150, md: 200 },
                    }}
                >
                    {isActive && children}
                </Box>
            </Box>
        </Paper>
    );
}
