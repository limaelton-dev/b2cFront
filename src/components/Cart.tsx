import React from 'react';
import { Box, Divider, Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { Close } from '@mui/icons-material';
import { useCart } from '../context/CartProvider';
import { useAlertDialog } from '../context/AlertDialogProvider';
import { useToastSide } from '../context/ToastSideProvider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getCartItemImage, truncateText, getCartItemPrice, formatPrice } from '@/utils/product';

export default function Cart({ cartOpened, onCartToggle }) {
    const { showToast } = useToastSide();
    const { openDialog } = useAlertDialog();
    const { cart, changeItemQuantity, removeItem, loading } = useCart();
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
                } catch (error) {
                    showToast('Erro ao remover item.', 'error');
                } finally {
                    markItemAsUpdating(skuId, false);
                }
            }
        });
    };

    const handleQuantityChange = async (skuId: number, newQuantity: number, maxStock?: number) => {
        if (newQuantity < 1) return;
        
        // Validar estoque
        if (maxStock && newQuantity > maxStock) {
            showToast(`Quantidade máxima disponível: ${maxStock}`, 'warning');
            return;
        }

        markItemAsUpdating(skuId, true);
        try {
            await changeItemQuantity(skuId, newQuantity);
        } catch (error) {
            showToast('Erro ao atualizar quantidade.', 'error');
        } finally {
            markItemAsUpdating(skuId, false);
        }
    };

    const handleIncrementQuantity = async (skuId: number, currentQuantity: number, maxStock?: number) => {
        // Validar estoque antes de incrementar
        if (maxStock && currentQuantity >= maxStock) {
            showToast(`Quantidade máxima disponível: ${maxStock}`, 'warning');
            return;
        }

        markItemAsUpdating(skuId, true);
        try {
            await changeItemQuantity(skuId, currentQuantity + 1);
        } catch (error) {
            showToast('Erro ao atualizar quantidade.', 'error');
        } finally {
            markItemAsUpdating(skuId, false);
        }
    };

    const handleDecrementQuantity = async (skuId: number, currentQuantity: number) => {
        if (currentQuantity <= 1) {
            // Quando quantidade = 1, remover item com confirmação
            handleAlertRemoveItem(skuId);
        } else {
            // Quando quantidade > 1, apenas decrementar
            markItemAsUpdating(skuId, true);
            try {
                await changeItemQuantity(skuId, currentQuantity - 1);
            } catch (error) {
                showToast('Erro ao atualizar quantidade.', 'error');
            } finally {
                markItemAsUpdating(skuId, false);
            }
        }
    };

    const hasItems = cart?.items && cart.items.length > 0;
    const hasUnavailableItems = cart?.items?.some(item => item.available === false) || false;

    return (
        <Drawer open={cartOpened} anchor="right">
            <Box component="div" sx={{ width: '30vw', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} role="presentation">
                {/* Header do carrinho */}
                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton aria-label="delete" onClick={handleCloseCart}>
                        <Close />
                    </IconButton>
                </div>

                {/* Divider */}
                <Divider style={{background: 'gray'}}/>
                
                {/* Aviso de itens indisponíveis */}
                {hasUnavailableItems && (
                    <div style={{ 
                        backgroundColor: '#fff3cd', 
                        color: '#856404', 
                        padding: '12px',
                        margin: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7',
                        fontSize: '13px'
                    }}>
                        ⚠️ Alguns itens do carrinho estão indisponíveis ou sem estoque.
                    </div>
                )}

                {/* Lista de produtos do carrinho */}
                <div className="products-cart">
                {!hasItems ? (
                    <p style={{textAlign: 'center', marginTop: '25px'}}>Carrinho vazio</p>
                ) : (
                    <>
                        {cart.items.map((item, index) => {
                            if (!item || !item.sku) return null;
                            
                            const sku = item.sku;
                            const product = sku.product;
                            const productName = product?.title || sku.title || 'Produto';
                            const isAvailable = item.available !== false;
                            const maxStock = sku.amount || undefined; // Quantidade em estoque
                            const isUpdating = isItemUpdating(item.skuId);
                            const isDisabled = !isAvailable || isUpdating;
                            
                            return (
                                <div 
                                    className="product" 
                                    data-test={item.skuId} 
                                    key={item.skuId || index}
                                    style={{ 
                                        opacity: isAvailable ? (isUpdating ? 0.7 : 1) : 0.6, 
                                        position: 'relative',
                                        transition: 'opacity 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                        <IconButton 
                                            style={{padding: '0px'}} 
                                            aria-label="delete" 
                                            onClick={() => handleAlertRemoveItem(item.skuId)}
                                            disabled={isUpdating}
                                            sx={{ 
                                                opacity: isUpdating ? 0.5 : 1,
                                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                                transition: 'opacity 0.2s'
                                            }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                    <Image
                                        src={getCartItemImage(item)}
                                        alt={productName}
                                        width={100}
                                        height={100}
                                        unoptimized={true}
                                    />
                                    <div className="name-qty">
                                        <Tooltip title={productName}>
                                            <span style={{ color: isAvailable ? 'inherit' : '#999' }}>
                                                {truncateText(productName, 36)}
                                            </span>
                                        </Tooltip>
                                        {!isAvailable && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: '#d32f2f', 
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#ffebee',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block',
                                                    marginTop: '4px'
                                                }}
                                            >
                                                Indisponível
                                            </Typography>
                                        )}
                                        {product?.brand && (
                                            <Typography variant="caption" color="text.secondary">
                                                {product.brand.name}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            SKU: {sku.partnerId || sku.ean}
                                        </Typography>
                                        {maxStock && maxStock > 0 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                                                Estoque: {maxStock}
                                            </Typography>
                                        )}
                                        <div className="quantity" style={{ position: 'relative' }}>
                                            <button 
                                                type='button'
                                                onClick={() => handleDecrementQuantity(item.skuId, item.quantity)}
                                                className="btn-qty decrement"
                                                disabled={isDisabled}
                                                style={{ 
                                                    opacity: isDisabled ? 0.5 : 1, 
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    transition: 'opacity 0.2s'
                                                }}
                                            >
                                                {isUpdating ? '⋯' : '-'}
                                            </button>
                                            <input 
                                                value={item.quantity || 1} 
                                                onChange={(e) => handleQuantityChange(item.skuId, Number(e.target.value), maxStock)} 
                                                type="number"
                                                min="1"
                                                max={maxStock}
                                                disabled={isDisabled}
                                                style={{ 
                                                    opacity: isDisabled ? 0.5 : 1,
                                                    transition: 'opacity 0.2s'
                                                }}
                                            />
                                            <button 
                                                type='button'
                                                onClick={() => handleIncrementQuantity(item.skuId, item.quantity, maxStock)}
                                                className="btn-qty increment"
                                                disabled={isDisabled || (maxStock !== undefined && item.quantity >= maxStock)}
                                                style={{ 
                                                    opacity: (isDisabled || (maxStock !== undefined && item.quantity >= maxStock)) ? 0.5 : 1, 
                                                    cursor: (isDisabled || (maxStock !== undefined && item.quantity >= maxStock)) ? 'not-allowed' : 'pointer',
                                                    transition: 'opacity 0.2s'
                                                }}
                                            >
                                                {isUpdating ? '⋯' : '+'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        <span className="price" style={{ color: isAvailable ? 'inherit' : '#999' }}>
                                            <b>R$ {formatPrice(getCartItemPrice(item))}</b>
                                        </span>
                                        {!isAvailable && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    fontSize: '10px',
                                                    color: '#999',
                                                    display: 'block',
                                                    marginTop: '2px'
                                                }}
                                            >
                                                Não incluído
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                </div>

                {/* Botão para ver todos os produtos */}
                <div className="cart-moreprod">
                    <a
                        href='/produtos'
                        className='btn-buy-primary'
                        style={{
                            borderBottomLeftRadius: '0px',
                            borderTopLeftRadius: '0px',
                            borderRadius: '14px',
                            padding: '5px 4px',
                            width: '250px',
                            maxWidth: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            fontFamily: 'system-ui'
                        }}
                    >
                        {!hasItems ? 'Veja todos os produtos' : 'Escolha mais produtos'}
                    </a>
                </div>
                {hasItems && (
                    <>
                        <Divider style={{background: 'gray'}}/>
                        <div className="cart-totals">
                            {/* Subtotal */}
                            <div className="totals">
                                <span>Subtotal: </span>
                                <span className='price-totals'>
                                    <b>R$ {formatPrice(cart.subtotal)}</b>
                                </span>
                            </div>
                            {hasUnavailableItems && (
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: '11px', 
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        display: 'block',
                                        marginTop: '4px'
                                    }}
                                >
                                    * Itens indisponíveis não são incluídos no subtotal
                                </Typography>
                            )}
                        </div>
                    </> 
                )}
                <a href="/checkout" className="link-to-buy">Finalizar Pedido</a>
            </Box>
        </Drawer>
    );
}