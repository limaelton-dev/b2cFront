import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Box, Button, Divider, Drawer, IconButton, TextField } from '@mui/material';
import Image from 'next/image';
import HeadphoneImg from '../assets/img/headphone.png';
import { Close } from '@mui/icons-material';
import { useCart } from '../context/cart';
import { useAlertDialog } from '../context/dialog';
import { useCoupon } from '../context/coupon';
import { useToastSide } from '../context/toastSide';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Cart({ cartOpened, onCartToggle }) {
    const { showToast } = useToastSide();
    const { openDialog } = useAlertDialog();
    const { statusMessage, activeCoupon, coupon, setCouponFn } = useCoupon();
    const { cartItems, cartData, changeQtyItem, removeFromCart } = useCart();
    const [inpCoupon, setInpCoupon] = useState<string>('');
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [errorCoupon, setErrorCoupon] = useState(false);
    const [discountPix, setDiscountPix] = useState(5);
    const [loadingCoupon, setLoadingCoupon] = useState(false);

    // Verificar se os dados do carrinho são válidos
    const isCartDataValid = () => {
        if (!Array.isArray(cartData) || !Array.isArray(cartItems)) {
            console.error('Dados do carrinho inválidos:', { cartData, cartItems });
            return false;
        }
        return true;
    };

    useEffect(() => {
        console.log('Componente do carrinho montado, dados:', { 
            cartItems: Array.isArray(cartItems) ? cartItems.length : 'não é array', 
            cartData: Array.isArray(cartData) ? cartData.length : 'não é array' 
        });
    }, [cartItems, cartData]);

    const handleCloseCart = () => {
        onCartToggle(false);
    }

    const handleInc = (i, id) => {
        const d = cartData.find(i => i.id == id)
        if(d.qty < max)
            changeQtyItem(id, d.qty + 1)
    };
    
    const handleDec = (i, id) => {
        const d = cartData.find(i => i.id == id)
        if(d.qty > min)
            changeQtyItem(id, d.qty - 1)
    };

    const handleInputChange = (i, e) => {
        const newV = Number(e.target.value)
        if(newV < min || newV > max) {
            if(newV < min) {
                changeQtyItem(i.pro_codigo, min)
            }
            if(newV > max) {
                changeQtyItem(i.pro_codigo, max)
            }
        }
        else {
            changeQtyItem(i.pro_codigo, newV)
        }
    };

    const handleCouponApply = () => {
        if(inpCoupon) {
            setLoadingCoupon(true);
            setTimeout(async () => {
                setLoadingCoupon(false);
                await setCouponFn({
                    id: 1,
                    name: 'teste',
                    percent_discount: 3,
                    prod_category: 1,
                    exp_date: '2024-10-15',
                });
            }, 2000);
            return true;
        }
        else {
            setErrorCoupon(true)
            showToast('Por favor, digite o cupom.','error')
        }
    }

    const handleAlertRemoveItem = (id, colorId) => {
        openDialog('Tem certeza que deseja remover este produto?', '', 'Não', 'Sim', (confirm) =>  {
            if(confirm) {
                if(removeFromCart(id, colorId)) {
                    showToast('Item removido.','success')
                }
            }
        })
    }

    const linkToProducts = () => {
        // Link para pagina de produtos
    }

    const handleChangeInpCoupon = (e) => {
        setInpCoupon(e.target.value);
    }

    // Função para caso tenha descontos diferentes
    const applyDiscounts = (val) => {
        let result = val; 
        if(coupon)
            result = val - ((coupon.percent_discount / 100) * val);

        return result;
    }

    const applyCouponDiscount = (val) => {
        if(coupon)
            return val - ((coupon.percent_discount / 100) * val);

        return val;
    }

    const applyPixDiscount = (val) => {
        if(!discountPix) return val

        if(coupon)
            return (val - ((coupon.percent_discount / 100) * val)) - ((discountPix / 100) * val);
        else
            return val - ((discountPix / 100) * val);
    }

    // const limitaTexto = ({ text }) => {
    //     return text.length > 36 ? text.substring(0, 36) + '...' : text;
    // }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    return (
        <Drawer
            anchor="right"
            open={cartOpened}
            onClose={handleCloseCart}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    maxWidth: '450px',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff',
                    padding: '20px',
                    paddingTop: '10px',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Meu Carrinho</h2>
                <IconButton onClick={handleCloseCart}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            
            {!isCartDataValid() ? (
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                    <p>Seu carrinho está vazio ou ocorreu um erro ao carregar os produtos.</p>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCloseCart}
                        sx={{ marginTop: '10px' }}
                    >
                        Continuar Comprando
                    </Button>
                </Box>
            ) : cartData.length === 0 ? (
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                    <p>Seu carrinho está vazio.</p>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCloseCart}
                        sx={{ marginTop: '10px' }}
                    >
                        Continuar Comprando
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                        {cartData.map((i, index) => {
                            const product = cartItems.find(item => item.pro_codigo == i.id);
                            if (!product) return null; // Pula itens sem produto correspondente
                            
                            return (
                                <Box 
                                    key={`${i.id}-${i.colorId || 'default'}`} 
                                    className="cart-item" 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ display: 'flex', gap: '10px', flex: 1 }}>
                                            <Box sx={{ width: '80px', height: '80px', position: 'relative' }}>
                                                <Image
                                                    src={product.imagens && product.imagens.length > 0 ? product.imagens[0].url : HeadphoneImg}
                                                    alt={product.pro_descricao || 'Produto'}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product.pro_descricao || 'Produto'}</h4>
                                                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>SKU: {product.pro_partnum_sku || 'N/A'}</p>
                                            </Box>
                                        </Box>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleAlertRemoveItem(i.id, i.colorId)}
                                            sx={{ padding: '4px' }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <Button 
                                                size="small" 
                                                onClick={() => handleDec(index, i.id)}
                                                sx={{ minWidth: '30px', padding: '2px' }}
                                            >-</Button>
                                            <input 
                                                value={i.qty} 
                                                min={min} 
                                                max={max} 
                                                onChange={(e) => handleInputChange(i, e)} 
                                                type="number"
                                                style={{ 
                                                    width: '40px', 
                                                    textAlign: 'center', 
                                                    border: 'none',
                                                    outline: 'none'
                                                }}
                                            />
                                            <Button 
                                                size="small" 
                                                onClick={() => handleInc(index, i.id)}
                                                sx={{ minWidth: '30px', padding: '2px' }}
                                            >+</Button>
                                        </Box>
                                        <Box sx={{ fontWeight: 'bold' }}>
                                            R$ {(product.pro_valorultimacompra * i.qty).toFixed(2).toString().replace('.',',')}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box sx={{ padding: '15px 0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Subtotal:</span>
                            <span>
                                <b>
                                    R$ {cartData.reduce((total, item) => {
                                        const product = cartItems.find(p => p.pro_codigo == item.id);
                                        return total + (product ? product.pro_valorultimacompra * item.qty : 0);
                                    }, 0).toFixed(2).replace('.', ',')}
                                </b>
                            </span>
                        </Box>
                        
                        <Box sx={{ marginBottom: '15px' }}>
                            <TextField
                                label="Cupom de desconto"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={inpCoupon}
                                onChange={handleChangeInpCoupon}
                                error={errorCoupon}
                                sx={{ marginBottom: '10px' }}
                            />
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                fullWidth
                                onClick={handleCouponApply}
                                disabled={loadingCoupon}
                            >
                                {loadingCoupon ? 'Aplicando...' : 'Aplicar Cupom'}
                            </Button>
                        </Box>
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            sx={{ marginTop: '10px' }}
                            onClick={() => window.location.href = '/checkout'}
                        >
                            Finalizar Compra
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            fullWidth
                            sx={{ marginTop: '10px' }}
                            onClick={handleCloseCart}
                        >
                            Continuar Comprando
                        </Button>
                    </Box>
                </Box>
            )}
        </Drawer>
    );
}