'use client';

import React from 'react';
import { Avatar, SxProps, Theme } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

function stringToColor(string: string): string {
    if (!string) return THEME_COLOR;
    
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
        '#252d5f', // azul tema
        '#1a2147', // azul escuro
        '#3d4a7a', // azul médio
        '#5c6b9e', // azul claro
        '#7a3d5f', // roxo
        '#3d7a5f', // verde
        '#5f3d7a', // violeta
        '#7a5f3d', // marrom
    ];

    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface UserAvatarProps {
    name?: string;
    size?: number;
    sx?: SxProps<Theme>;
    onClick?: () => void;
}

export default function UserAvatar({ name, size = 40, sx, onClick }: UserAvatarProps) {
    const initials = getInitials(name || '');
    const bgColor = stringToColor(name || '');

    if (!name) {
        return (
            <Avatar
                onClick={onClick}
                sx={{
                    width: size,
                    height: size,
                    bgcolor: 'transparent',
                    border: '2px solid #bcbcbc',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '&:hover': onClick ? {
                        borderColor: THEME_COLOR,
                        '& svg': { color: THEME_COLOR },
                    } : {},
                    ...sx,
                }}
            >
                <PersonOutline sx={{ color: '#bcbcbc', fontSize: size * 0.6 }} />
            </Avatar>
        );
    }

    return (
        <Avatar
            onClick={onClick}
            sx={{
                width: size,
                height: size,
                bgcolor: bgColor,
                color: '#fff',
                fontWeight: 600,
                fontSize: size * 0.4,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease',
                '&:hover': onClick ? {
                    transform: 'scale(1.05)',
                } : {},
                ...sx,
            }}
        >
            {initials}
        </Avatar>
    );
}

