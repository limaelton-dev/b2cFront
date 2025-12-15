'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    InputBase,
    IconButton,
    Paper,
    Skeleton,
} from '@mui/material';
import { Search, ShoppingBagOutlined } from '@mui/icons-material';
import OrderCard from '@/features/account/components/layout/ui/OrderCard';
import { CompraType, OrderStatusDisplay } from '@/features/account/types';
import { Order, OrderStatus } from '@/api/orders/types/order';
import { fetchOrders } from '@/api/orders/services/order-service';

const THEME_COLOR = '#252d5f';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`orders-tabpanel-${index}`}
            aria-labelledby={`orders-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

function mapOrderStatusToDisplay(status: OrderStatus): OrderStatusDisplay {
    switch (status) {
        case OrderStatus.WAITING_PAYMENT:
            return 'Aguardando Pagamento';
        case OrderStatus.PENDING:
        case OrderStatus.INCOMPLETE:
        case OrderStatus.PAID_WAITING_SHIP:
        case OrderStatus.INVOICED:
        case OrderStatus.PAID_WAITING_DELIVERY:
            return 'Processando';
        case OrderStatus.IN_TRANSIT:
            return 'A caminho';
        case OrderStatus.CONCLUDED:
            return 'Entregue';
        case OrderStatus.CANCELED:
            return 'Cancelada';
        case OrderStatus.DELIVERY_ISSUE:
            return 'Problema na Entrega';
        default:
            return 'Processando';
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function mapOrderToCompra(order: Order): CompraType {
    return {
        id: order.id,
        partnerOrderId: order.partnerOrderId,
        produtos: order.items.map((item) => ({
            id: item.id,
            skuId: item.skuId,
            nome: item.title,
            valor: `R$ ${item.unitPrice.replace('.', ',')}`,
            quantidade: item.quantity,
        })),
        status: mapOrderStatusToDisplay(order.status),
        data: formatDate(order.createdAt),
        valorTotal: `R$ ${order.grandTotal.replace('.', ',')}`,
    };
}

function OrderListSkeleton() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
                <Skeleton
                    key={i}
                    variant="rounded"
                    height={120}
                    sx={{ borderRadius: 2 }}
                />
            ))}
        </Box>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(37, 45, 95, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                }}
            >
                <ShoppingBagOutlined sx={{ fontSize: 36, color: '#999' }} />
            </Box>
            <Typography
                variant="body1"
                sx={{ color: '#666', textAlign: 'center' }}
            >
                {message}
            </Typography>
        </Box>
    );
}

const MinhasCompras: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [pedidos, setPedidos] = useState<CompraType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const orders = await fetchOrders();
            const mappedOrders = orders.map(mapOrderToCompra);
            setPedidos(mappedOrders);
        } catch (err: any) {
            setError(err?.message || 'Erro ao carregar pedidos');
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const filteredPedidos = pedidos.filter((pedido) => {
        if (tabValue === 1 && pedido.status !== 'Entregue') return false;
        if (tabValue === 2 && pedido.status !== 'Cancelada') return false;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesId = pedido.id.toString().includes(term);
            const matchesPartnerOrderId = pedido.partnerOrderId
                .toLowerCase()
                .includes(term);
            if (!matchesId && !matchesPartnerOrderId) return false;
        }

        return true;
    });

    const renderOrderList = (emptyMessage: string) => {
        if (loading) {
            return <OrderListSkeleton />;
        }

        if (error) {
            return (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 5,
                        px: 3,
                        bgcolor: 'rgba(244, 67, 54, 0.04)',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                        {error}
                    </Typography>
                </Box>
            );
        }

        if (filteredPedidos.length === 0) {
            return <EmptyState message={emptyMessage} />;
        }

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredPedidos.map((pedido) => (
                    <OrderCard key={pedido.id} pedido={pedido} />
                ))}
            </Box>
        );
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        color: THEME_COLOR,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                    }}
                >
                    Minhas Compras
                </Typography>

                <Paper
                    component="form"
                    onSubmit={handleSearch}
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: { xs: '100%', sm: 280 },
                        border: '1px solid #e8e8e8',
                        borderRadius: 2,
                        bgcolor: '#fafafa',
                        transition: 'all 0.2s ease',
                        '&:focus-within': {
                            borderColor: THEME_COLOR,
                            bgcolor: '#fff',
                        },
                    }}
                >
                    <InputBase
                        sx={{
                            ml: 1.5,
                            flex: 1,
                            fontSize: '0.875rem',
                            py: 0.75,
                        }}
                        placeholder="Buscar por número do pedido"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton
                        type="submit"
                        sx={{ p: 1, color: '#999' }}
                        aria-label="buscar"
                    >
                        <Search sx={{ fontSize: 20 }} />
                    </IconButton>
                </Paper>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid #e8e8e8',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: '#e8e8e8', bgcolor: '#fafafa' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="pedidos tabs"
                        sx={{
                            minHeight: 48,
                            '& .MuiTab-root': {
                                fontSize: '0.875rem',
                                textTransform: 'none',
                                fontWeight: 500,
                                color: '#666',
                                minHeight: 48,
                                px: 3,
                                '&.Mui-selected': {
                                    color: THEME_COLOR,
                                    fontWeight: 600,
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: THEME_COLOR,
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                        }}
                    >
                        <Tab label="Todos" />
                        <Tab label="Entregues" />
                        <Tab label="Cancelados" />
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, bgcolor: '#fff' }}>
                    <TabPanel value={tabValue} index={0}>
                        {renderOrderList('Você ainda não realizou nenhuma compra.')}
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        {renderOrderList('Nenhum pedido entregue encontrado.')}
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        {renderOrderList('Nenhum pedido cancelado encontrado.')}
                    </TabPanel>
                </Box>
            </Paper>
        </Box>
    );
};

export default MinhasCompras;
