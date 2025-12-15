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
    Tooltip,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    PersonOutline,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthProvider';
import { UserAvatar } from '../../common';

const THEME_COLOR = '#252d5f';

type User = { name?: string; email?: string } | null | undefined;

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const { logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const isLoggedIn = Boolean(user?.name);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
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

    return (
        <>
            <Tooltip title={isLoggedIn ? 'Minha conta' : ''} arrow>
                <Box
                    onClick={handleClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(37, 45, 95, 0.05)',
                            '& .user-icon': { color: THEME_COLOR },
                            '& .user-text': { color: THEME_COLOR },
                        },
                    }}
                >
                    {isLoggedIn ? (
                        <UserAvatar name={user?.name} size={26} />
                    ) : (
                        <PersonOutline
                            className="user-icon"
                            sx={{
                                fontSize: 26,
                                color: '#666',
                                transition: 'color 0.2s ease',
                            }}
                        />
                    )}
                    <Typography
                        className="user-text"
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: '#666',
                            fontSize: '0.85rem',
                            display: { xs: 'none', sm: 'block' },
                            transition: 'color 0.2s ease',
                            maxWidth: 80,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isLoggedIn ? user?.name?.split(' ')[0] : ''}
                    </Typography>
                </Box>
            </Tooltip>

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
                {isLoggedIn ? (
                    <>
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                                {user?.name}
                            </Typography>
                            {user?.email && (
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
                    </>
                ) : (
                    <>
                        <MenuItem onClick={goLogin} sx={{ py: 1.5 }}>
                            <ListItemIcon>
                                <PersonOutline fontSize="small" sx={{ color: THEME_COLOR }} />
                            </ListItemIcon>
                            <ListItemText primary="Entrar" />
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={goRegister} sx={{ py: 1.5 }}>
                            <ListItemIcon>
                                <AccountCircle fontSize="small" sx={{ color: THEME_COLOR }} />
                            </ListItemIcon>
                            <ListItemText primary="Criar conta" />
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
}
