'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    Login,
    PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthProvider';
import { UserAvatar } from '../../common';

const THEME_COLOR = '#252d5f';

type User = { name?: string; email?: string };

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const { logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (user?.name) {
            setAnchorEl(event.currentTarget);
        } else {
            router.push('/login');
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goAccount = () => {
        handleClose();
        router.push('/minhaconta');
    };

    const goLogin = () => {
        handleClose();
        router.push('/login');
    };

    const goRegister = () => {
        handleClose();
        router.push('/register');
    };

    const onLogout = async () => {
        handleClose();
        try {
            await logout();
            router.push('/');
        } catch (e) {
            console.error('Falha ao sair:', e);
        }
    };

    if (!user?.name) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar onClick={goLogin} size={42} />
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Button
                            onClick={goLogin}
                            variant="text"
                            size="small"
                            sx={{
                                color: THEME_COLOR,
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                p: 0,
                                minWidth: 'auto',
                                textTransform: 'none',
                                justifyContent: 'flex-start',
                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                            }}
                        >
                            Entre
                        </Button>
                        <Typography variant="caption" sx={{ color: '#666', lineHeight: 1 }}>
                            ou{' '}
                            <Button
                                onClick={goRegister}
                                variant="text"
                                size="small"
                                sx={{
                                    color: THEME_COLOR,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    p: 0,
                                    minWidth: 'auto',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                                }}
                            >
                                Cadastre-se
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: 2,
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: 'rgba(37, 45, 95, 0.05)' },
                }}
            >
                <UserAvatar name={user.name} size={42} />
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: '#333',
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {user.name}
                    </Typography>
                    {user.email && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#666',
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                            }}
                        >
                            {user.email}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        {user.name}
                    </Typography>
                    {user.email && (
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            {user.email}
                        </Typography>
                    )}
                </Box>
                <Divider />
                <MenuItem onClick={goAccount} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" sx={{ color: THEME_COLOR }} />
                    </ListItemIcon>
                    <ListItemText primary="Minha Conta" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={onLogout} sx={{ py: 1.5, color: '#d32f2f' }}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: '#d32f2f' }} />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                </MenuItem>
            </Menu>
        </>
    );
}
