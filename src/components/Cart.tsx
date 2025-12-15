'use client';

import React from 'react';
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    Button,
    Divider,
    Badge,
    Paper,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Close,
    ShoppingCart,
    DeleteOutline,
    Add,
    Remove,
    ShoppingBagOutlined,
    ArrowForward,
} from '@mui/icons-material';
import Image from 'next/image';
import { useCart } from '../context/CartProvider';
import { useAlertDialog } from '../context/AlertDialogProvider';
import { useToastSide } from '../context/ToastSideProvider';
import { getCartItemImage, truncateText, getCartItemPrice, formatPrice } from '@/utils/product';

const THEME_COLOR = '#252d5f';

interface CartProps {
    cartOpened: boolean;
    onCartToggle: (open: boolean) => void;
}

export default function Cart({ cartOpened, onCartToggle }: CartProps) {
    const { showToast } = useToastSide();
    const { openDialog } = useAlertDialog();
    const { cart, changeItemQuantity, removeItem } = useCart();
    const [updatingItems, setUpdatingItems] = React.useState<Set<number>>(new Set());

    const handleCloseCart = () => {
        onCartToggle(false);
    };

    const isItemUpdating = (skuId: number) => updatingItems.has(skuId);

    const markItemAsUpdating = (skuId: number, updating: boolean) => {
        setUpdatingItems(prev => {
            const next = new Set(prev);
            if (updating) {
                next.add(skuId);
            } else {
                next.delete(skuId);
            }
            return next;
        });
    };

    const handleAlertRemoveItem = (skuId: number) => {
        openDialog('Tem certeza que deseja remover este produto?', '', 'Não', 'Sim', async (confirm) => {
            if (confirm) {
                markItemAsUpdating(skuId, true);
                try {
                    await removeItem(skuId);
                    showToast('Item removido.', 'success');
                } catch {
                    showToast('Erro ao remover item.', 'error');
                } finally {
                    markItemAsUpdating(skuId, false);
                }
            }
        });
    };

    const handleIncrementQuantity = async (skuId: number, currentQuantity: number, maxStock?: number) => {
        if (maxStock && currentQuantity >= maxStock) {
            showToast(`Quantidade máxima disponível: ${maxStock}`, 'warning');
            return;
        }

        markItemAsUpdating(skuId, true);
        try {
            await changeItemQuantity(skuId, currentQuantity + 1);
        } catch {
            showToast('Erro ao atualizar quantidade.', 'error');
        } finally {
            markItemAsUpdating(skuId, false);
        }
    };

    const handleDecrementQuantity = async (skuId: number, currentQuantity: number) => {
        if (currentQuantity <= 1) {
            handleAlertRemoveItem(skuId);
        } else {
            markItemAsUpdating(skuId, true);
            try {
                await changeItemQuantity(skuId, currentQuantity - 1);
            } catch {
                showToast('Erro ao atualizar quantidade.', 'error');
            } finally {
                markItemAsUpdating(skuId, false);
            }
        }
    };

    const hasItems = cart?.items && cart.items.length > 0;
    const hasUnavailableItems = cart?.items?.some(item => item.available === false) || false;
    const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    return (
        <Drawer
            open={cartOpened}
            anchor="right"
            onClose={handleCloseCart}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 400 },
                    maxWidth: '100%',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid #e8e8e8',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Badge
                            badgeContent={itemCount}
                            color="primary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: THEME_COLOR,
                                },
                            }}
                        >
                            <ShoppingCart sx={{ color: THEME_COLOR, fontSize: 28 }} />
                        </Badge>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                            Meu Carrinho
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseCart} size="small">
                        <Close />
                    </IconButton>
                </Box>

                {/* Warning for unavailable items */}
                {hasUnavailableItems && (
                    <Box
                        sx={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            px: 2,
                            py: 1.5,
                            mx: 2,
                            mt: 2,
                            borderRadius: 2,
                            fontSize: '0.85rem',
                            border: '1px solid #ffeaa7',
                        }}
                    >
                        ⚠️ Alguns itens estão indisponíveis ou sem estoque.
                    </Box>
                )}

                {/* Cart Items */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: 2,
                        py: 2,
                    }}
                >
                    {!hasItems ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                textAlign: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 3,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(37, 45, 95, 0.08)',
                                }}
                            >
                                <ShoppingBagOutlined
                                    sx={{ fontSize: 60, color: THEME_COLOR, opacity: 0.6 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                                Seu carrinho está vazio
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                                Adicione produtos para continuar comprando
                            </Typography>
                            <Button
                                href="/produtos"
                                variant="contained"
                                sx={{
                                    backgroundColor: THEME_COLOR,
                                    '&:hover': { backgroundColor: '#1a2147' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 3,
                                }}
                            >
                                Ver produtos
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {cart.items.map((item, index) => {
                                if (!item || !item.sku) return null;

                                const sku = item.sku;
                                const product = sku.product;
                                const productName = product?.title || sku.title || 'Produto';
                                const isAvailable = item.available !== false;
                                const maxStock = sku.amount || undefined;
                                const isUpdating = isItemUpdating(item.skuId);
                                const isDisabled = !isAvailable || isUpdating;

                                return (
                                    <Paper
                                        key={item.skuId || index}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e8e8e8',
                                            opacity: isAvailable ? 1 : 0.6,
                                            position: 'relative',
                                            transition: 'opacity 0.2s',
                                        }}
                                    >
                                        {isUpdating && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                                    borderRadius: 2,
                                                    zIndex: 1,
                                                }}
                                            >
                                                <CircularProgress size={24} sx={{ color: THEME_COLOR }} />
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            {/* Product Image */}
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    backgroundColor: '#fafafa',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Image
                                                    src={getCartItemImage(item)}
                                                    alt={productName}
                                                    width={80}
                                                    height={80}
                                                    unoptimized
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>

                                            {/* Product Info */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <Tooltip title={productName}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: isAvailable ? '#333' : '#999',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                pr: 1,
                                                            }}
                                                        >
                                                            {truncateText(productName, 40)}
                                                        </Typography>
                                                    </Tooltip>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleAlertRemoveItem(item.skuId)}
                                                        disabled={isUpdating}
                                                        sx={{ p: 0.5, color: '#999' }}
                                                    >
                                                        <DeleteOutline fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                                {product?.brand && (
                                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                                        {product.brand.name}
                                                    </Typography>
                                                )}

                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: '#999', display: 'block', mb: 1 }}
                                                >
                                                    SKU: {sku.partnerId || sku.ean}
                                                </Typography>

                                                {!isAvailable && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#d32f2f',
                                                            fontWeight: 600,
                                                            backgroundColor: '#ffebee',
                                                            px: 1,
                                                            py: 0.25,
                                                            borderRadius: 1,
                                                            display: 'inline-block',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        Indisponível
                                                    </Typography>
                                                )}

                                                {/* Quantity and Price */}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {/* Quantity Controls */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            border: '1px solid #e8e8e8',
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleDecrementQuantity(item.skuId, item.quantity)
                                                            }
                                                            disabled={isDisabled}
                                                            sx={{
                                                                borderRadius: 0,
                                                                p: 0.5,
                                                                '&:hover': { backgroundColor: '#f5f5f5' },
                                                            }}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <Typography
                                                            sx={{
                                                                px: 2,
                                                                minWidth: 40,
                                                                textAlign: 'center',
                                                                fontWeight: 600,
                                                                fontSize: '0.9rem',
                                                            }}
                                                        >
                                                            {item.quantity || 1}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleIncrementQuantity(
                                                                    item.skuId,
                                                                    item.quantity,
                                                                    maxStock
                                                                )
                                                            }
                                                            disabled={
                                                                isDisabled ||
                                                                (maxStock !== undefined &&
                                                                    item.quantity >= maxStock)
                                                            }
                                                            sx={{
                                                                borderRadius: 0,
                                                                p: 0.5,
                                                                '&:hover': { backgroundColor: '#f5f5f5' },
                                                            }}
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Price */}
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: isAvailable ? THEME_COLOR : '#999',
                                                        }}
                                                    >
                                                        R$ {formatPrice(getCartItemPrice(item))}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{ borderTop: '1px solid #e8e8e8' }}>
                    {/* Continue Shopping Link */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 1.5,
                            borderBottom: '1px solid #e8e8e8',
                        }}
                    >
                        <Button
                            href="/produtos"
                            variant="text"
                            endIcon={<ArrowForward fontSize="small" />}
                            sx={{
                                color: THEME_COLOR,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(37, 45, 95, 0.08)',
                                },
                            }}
                        >
                            {hasItems ? 'Continuar comprando' : 'Ver todos os produtos'}
                        </Button>
                    </Box>

                    {hasItems && (
                        <Box sx={{ p: 2 }}>
                            {/* Subtotal */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    Subtotal
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                                    R$ {formatPrice(cart.subtotal)}
                                </Typography>
                            </Box>

                            {hasUnavailableItems && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#666',
                                        fontStyle: 'italic',
                                        display: 'block',
                                        textAlign: 'center',
                                        mb: 2,
                                    }}
                                >
                                    * Itens indisponíveis não são incluídos no subtotal
                                </Typography>
                            )}

                            {/* Checkout Button */}
                            <Button
                                href="/checkout"
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{
                                    backgroundColor: THEME_COLOR,
                                    color: '#fff',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontSize: '0.95rem',
                                    '&:hover': {
                                        backgroundColor: '#1a2147',
                                    },
                                }}
                            >
                                Finalizar Pedido
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}
