'use client';

import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

interface SocialLoginDividerProps {
    text?: string;
}

export default function SocialLoginDivider({ text = 'ou' }: SocialLoginDividerProps) {
    return (
        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Divider sx={{ flex: 1, borderColor: '#e0e0e0' }} />
            <Typography
                variant="body2"
                sx={{
                    color: '#888',
                    fontWeight: 500,
                    textTransform: 'lowercase',
                }}
            >
                {text}
            </Typography>
            <Divider sx={{ flex: 1, borderColor: '#e0e0e0' }} />
        </Box>
    );
}

