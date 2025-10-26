import React from 'react';
import { Box, Divider, Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import HeadphoneImg from '../assets/img/headphone.png';
import { Close } from '@mui/icons-material';
import { useCart } from '../context/CartProvider';
import { useAlertDialog } from '../context/AlertDialogProvider';
import { useToastSide } from '../context/ToastSideProvider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Cart({ cartOpened, onCartToggle }) {
    const { showToast } = useToastSide();
    const { openDialog } = useAlertDialog();
    const { cart, changeItemQuantity, addItem, removeItem } = useCart();

    const handleCloseCart = () => {
        onCartToggle(false);
    };

    const handleAlertRemoveItem = (skuId: number) => {
        openDialog('Tem certeza que deseja remover este produto?', '', 'Não', 'Sim', async (confirm) => {
            if (confirm) {
                try {
                    await removeItem(skuId);
                    showToast('Item removido.', 'success');
                } catch (error) {
                    showToast('Erro ao remover item.', 'error');
                }
            }
        });
    };

    const handleQuantityChange = async (skuId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await changeItemQuantity(skuId, newQuantity);
        } catch (error) {
            showToast('Erro ao atualizar quantidade.', 'error');
        }
    };

    const handleIncrementQuantity = async (skuId: number) => {
        try {
            await addItem(skuId);
        } catch (error) {
            showToast('Erro ao adicionar item.', 'error');
        }
    };

    const handleDecrementQuantity = async (skuId: number, currentQuantity: number) => {
        if (currentQuantity <= 1) {
            handleAlertRemoveItem(skuId);
        } else {
            try {
                await changeItemQuantity(skuId, currentQuantity - 1);
            } catch (error) {
                showToast('Erro ao atualizar quantidade.', 'error');
            }
        }
    };

    const limitaTexto = (text: string | undefined, maxLength = 36) => {
        return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || '';
    };

    const getItemPrice = (item: any) => {
        const price = item.sku?.sellPrice || item.sku?.price || 0;
        return price * item.quantity;
    };

    const formatPrice = (price: number) => {
        if (isNaN(price) || price === null || price === undefined) {
            return '0,00';
        }
        return price.toFixed(2).toString().replace('.', ',');
    };

    const hasItems = cart?.items && cart.items.length > 0;

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
                            
                            // Buscar imagem do produto
                            const getProductImage = () => {
                                if (product?.images && product.images.length > 0) {
                                    const mainImg = product.images.find(img => img.main) || product.images[0];
                                    return mainImg.standardUrl || mainImg.originalImage || mainImg.url || HeadphoneImg;
                                }
                                return HeadphoneImg;
                            };
                            
                            return (
                                <div className="product" data-test={item.skuId} key={item.skuId || index}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                        <IconButton 
                                            style={{padding: '0px'}} 
                                            aria-label="delete" 
                                            onClick={() => handleAlertRemoveItem(item.skuId)}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                    <Image
                                        src={getProductImage()}
                                        alt={productName}
                                        width={100}
                                        height={100}
                                        unoptimized={true}
                                    />
                                    <div className="name-qty">
                                        <Tooltip title={productName}>
                                            <span>{limitaTexto(productName, 36)}</span>
                                        </Tooltip>
                                        {product?.brand && (
                                            <Typography variant="caption" color="text.secondary">
                                                {product.brand.name}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            SKU: {sku.partnerId || sku.ean}
                                        </Typography>
                                        <div className="quantity">
                                            <button 
                                                type='button'
                                                onClick={() => handleDecrementQuantity(item.skuId, item.quantity)}
                                                className="btn-qty decrement"
                                            >
                                                -
                                            </button>
                                            <input 
                                                value={item.quantity || 1} 
                                                onChange={(e) => handleQuantityChange(item.skuId, Number(e.target.value))} 
                                                type="number"
                                            />
                                            <button 
                                                type='button'
                                                onClick={() => handleIncrementQuantity(item.skuId)}
                                                className="btn-qty increment"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        <span className="price">
                                            <b>R$ {formatPrice(getItemPrice(item))}</b>
                                        </span>
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
                        </div>
                    </> 
                )}
                <a href="/checkout" className="link-to-buy">Finalizar Pedido</a>
            </Box>
        </Drawer>
    );
}