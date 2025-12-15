'use client';

import React from 'react';
import { Typography, Box, Button, SxProps, Theme } from '@mui/material';

const THEME_COLOR = '#252d5f';

interface InfoCardProps {
    label: string;
    description: React.ReactNode;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    contentSx?: SxProps<Theme>;
}

const InfoCard: React.FC<InfoCardProps> = ({
    label,
    description,
    icon,
    actionLabel = 'Alterar',
    onAction,
    contentSx,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                borderBottom: '1px solid #f0f0f0',
                '&:last-child': {
                    borderBottom: 'none',
                },
                ...contentSx,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {icon && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(37, 45, 95, 0.06)',
                        }}
                    >
                        {React.cloneElement(icon as React.ReactElement, {
                            sx: { color: THEME_COLOR, fontSize: 18 },
                        })}
                    </Box>
                )}
                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            color: '#888',
                            display: 'block',
                            mb: 0.25,
                        }}
                    >
                        {label}
                    </Typography>
                    <Box
                        sx={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#333',
                        }}
                    >
                        {description}
                    </Box>
                </Box>
            </Box>

            {onAction && (
                <Button
                    variant="text"
                    onClick={onAction}
                    size="small"
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: THEME_COLOR,
                        textTransform: 'none',
                        px: 1.5,
                        '&:hover': {
                            bgcolor: 'rgba(37, 45, 95, 0.06)',
                        },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default InfoCard;
