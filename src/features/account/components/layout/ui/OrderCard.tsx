'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    IconButton,
    Chip,
    Paper,
    Collapse,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    LocalShipping,
    CheckCircleOutline,
    CancelOutlined,
    Schedule,
    Payment,
    ErrorOutline,
    ShoppingBagOutlined,
} from '@mui/icons-material';
import Image from 'next/image';
import NoImage from '@/assets/img/noimage.png';
import { CompraType, OrderStatusDisplay } from '../../../types';

const THEME_COLOR = '#252d5f';

interface OrderCardProps {
    pedido: CompraType;
}

const statusConfig: Record<
    OrderStatusDisplay,
    { icon: React.ReactNode; color: string; bgColor: string }
> = {
    'A caminho': {
        icon: <LocalShipping sx={{ fontSize: 14 }} />,
        color: '#1976d2',
        bgColor: 'rgba(25, 118, 210, 0.08)',
    },
    Entregue: {
        icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
        color: '#2e7d32',
        bgColor: 'rgba(46, 125, 50, 0.08)',
    },
    Cancelada: {
        icon: <CancelOutlined sx={{ fontSize: 14 }} />,
        color: '#d32f2f',
        bgColor: 'rgba(211, 47, 47, 0.08)',
    },
    Processando: {
        icon: <Schedule sx={{ fontSize: 14 }} />,
        color: '#ed6c02',
        bgColor: 'rgba(237, 108, 2, 0.08)',
    },
    'Aguardando Pagamento': {
        icon: <Payment sx={{ fontSize: 14 }} />,
        color: '#7b1fa2',
        bgColor: 'rgba(123, 31, 162, 0.08)',
    },
    'Problema na Entrega': {
        icon: <ErrorOutline sx={{ fontSize: 14 }} />,
        color: '#c2185b',
        bgColor: 'rgba(194, 24, 91, 0.08)',
    },
};

const OrderCard: React.FC<OrderCardProps> = ({ pedido }) => {
    const [expanded, setExpanded] = useState(false);
    const { id, partnerOrderId, produtos, status, data, valorTotal } = pedido;

    const config = statusConfig[status] || statusConfig['Processando'];
    const totalItems = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid #e8e8e8',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: '#d0d0d0',
                },
            }}
        >
            <Box sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: '#333',
                            }}
                        >
                            Pedido #{partnerOrderId || id}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#888',
                                fontSize: '0.8rem',
                                mt: 0.5,
                            }}
                        >
                            {data}
                        </Typography>
                    </Box>

                    <Chip
                        icon={config.icon}
                        label={status}
                        size="small"
                        sx={{
                            bgcolor: config.bgColor,
                            color: config.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 26,
                            '& .MuiChip-icon': {
                                color: config.color,
                            },
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                fontSize: '0.8rem',
                            }}
                        >
                            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: THEME_COLOR,
                                mt: 0.25,
                            }}
                        >
                            {valorTotal}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(37, 45, 95, 0.06)',
                            '&:hover': {
                                bgcolor: 'rgba(37, 45, 95, 0.1)',
                            },
                        }}
                    >
                        {expanded ? (
                            <KeyboardArrowUp sx={{ fontSize: 20, color: '#666' }} />
                        ) : (
                            <KeyboardArrowDown sx={{ fontSize: 20, color: '#666' }} />
                        )}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={expanded} timeout={200}>
                <Divider />
                <Box sx={{ p: 2.5, bgcolor: '#fafafa' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#666',
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Itens do pedido
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {produtos.map((produto, index) => (
                            <Box
                                key={`produto-${produto.skuId || index}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1.5,
                                    bgcolor: '#fff',
                                    borderRadius: 1.5,
                                    border: '1px solid #f0f0f0',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 1.5,
                                        bgcolor: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}
                                >
                                    {produto.imagem ? (
                                        <Image
                                            src={produto.imagem}
                                            alt={produto.nome}
                                            width={56}
                                            height={56}
                                            style={{ objectFit: 'contain' }}
                                            unoptimized
                                        />
                                    ) : (
                                        <ShoppingBagOutlined sx={{ fontSize: 24, color: '#ccc' }} />
                                    )}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            color: '#333',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {produto.nome}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#888',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        Qtd: {produto.quantidade}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: '#333',
                                        flexShrink: 0,
                                    }}
                                >
                                    {produto.valor}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default OrderCard;
