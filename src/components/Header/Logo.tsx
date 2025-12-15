'use client';

import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import LogoColetek from '../../assets/img/logo_coletek.png';

interface LogoProps {
    onClick: () => void;
}

export default function Logo({ onClick }: LogoProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.85 },
            }}
            aria-label="Ir para a home"
        >
            <Image
                src={LogoColetek}
                alt="Logo Coletek"
                priority
                style={{
                    width: 'auto',
                    height: 50,
                    maxWidth: 160,
                }}
            />
        </Box>
    );
}
