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

    // Verifica se os dados do carrinho estão sincronizados
    const isCartDataValid = () => {
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) return false;
        if (!cartData || !Array.isArray(cartData) || cartData.length === 0) return false;
        
        // Verifica se todos os itens no cartData têm um produto correspondente em cartItems
        return cartData.every(item => 
            cartItems.some(product => product && product.pro_codigo == item.id)
        );
    };

    return (
        <Drawer open={cartOpened} anchor="right">
            <Box component="div" sx={{ width: '30vw', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} role="presentation">
                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton aria-label="delete" onClick={handleCloseCart}>
                        <Close />
                    </IconButton>
                </div>
                <Divider style={{background: 'gray'}}/>
                <div className="products-cart">
                {!isCartDataValid() ? (
                    <p style={{textAlign: 'center', marginTop: '25px'}}>Carrinho vazio</p>
                ) : (
                    <>
                        {cartData.map((item, index) => {
                            // Encontra o produto correspondente ao item do carrinho
                            const product = cartItems.find(r => r && r.pro_codigo == item.id);
                            // Se não encontrar o produto, pula este item
                            if (!product) return <React.Fragment key={item.id}></React.Fragment>;
                            
                            return (
                                <div className="product" data-test={item.id} key={item.id}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                        <IconButton style={{padding: '0px'}} aria-label="delete" onClick={() => handleAlertRemoveItem(item.id, item.colorId)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                    <Image
                                        src={HeadphoneImg}
                                        alt="HeadphoneImg"
                                        width={100}
                                    />
                                    <div className="name-qty">
                                        <span>{product.pro_descricao}</span>
                                        <div className="quantity">
                                            <button 
                                                type='button'
                                                onClick={() => handleDec(index, item.id)}
                                                className="btn-qty decrement">-</button>
                                            <input value={item.qty} min={min} max={max} onChange={(e) => handleInputChange(item, e)} type="number"/>
                                            <button 
                                                type='button'
                                                onClick={() => handleInc(index, item.id)}
                                                className="btn-qty increment">+</button>
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        <span className="price">
                                            <b>R$ {(product.pro_valorultimacompra * item.qty).toFixed(2).toString().replace('.',',')}</b>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                </div>
                <div className="cart-moreprod">
                    <Button
                        onClick={linkToProducts}
                        variant="outlined"
                        style={{
                            borderBottomLeftRadius: '0px',
                            borderTopLeftRadius: '0px',
                            borderRadius: '15px',
                        }}
                    >
                        Escolha mais produtos
                    </Button>
                </div>
                <Divider style={{background: 'gray'}}/>
                <div className="coupon-code">
                    <span>Digite um cupom de desconto:</span>
                    <div className="apply">
                        <div className="input-cupom">
                            {loadingCoupon && <>
                                <div className="circle1 circles"></div>
                                <div className="circle2 circles"></div>
                                <div className="circle3 circles"></div>
                            </>
                            }
                            <TextField 
                                error={errorCoupon}
                                id="outlined-basic"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderBottomRightRadius: '0px',
                                        borderTopRightRadius: '0px',
                                    },
                                    '& .MuiOutlinedInput-root input': {
                                        padding: '8px 10px 8px 10px',
                                    },
                                }}
                                placeholder="Cupom"
                                variant="outlined"
                                value={inpCoupon}
                                disabled={loadingCoupon}
                                onChange={(e) => {setInpCoupon(e.target.value)}}
                            />
                        </div>
                        <Button
                            onClick={handleCouponApply}
                            variant="contained"
                            style={{
                                borderBottomLeftRadius: '0px',
                                borderTopLeftRadius: '0px',
                            }}
                     
                        >
                            Aplicar
                        </Button>
                    </div>
                    {coupon && loadingCoupon != true &&
                        <span className='coupon-status' style={{color: activeCoupon ? 'green' : 'red'}}>
                            {activeCoupon == true && 
                                <CheckIcon fontSize="inherit" />
                            }
                            {activeCoupon == false && 
                                <CloseIcon fontSize="inherit" />
                            }
                            {statusMessage}
                        </span>
                    }
                </div>
                <Divider style={{background: 'gray'}}/>
                <div className="cart-totals">
                    <div className="totals">
                        <span>Subtotal: </span>
                        <span className='price-totals'>
                            <b>R$ {cartData.reduce((total, item) => {
                                        const cartItem = cartItems.find(i => i.pro_codigo === item.id);
                                        if (cartItem) {
                                            return total + (cartItem.pro_valorultimacompra * item.qty);
                                        }
                                        return total;
                                    }, 0)
                                    .toFixed(2)
                                    .replace('.', ',')
                                }
                            </b>
                        </span>
                    </div>
                    <div className="totals discount">
                        <span style={{height: '32px'}}>Descontos: 
                            {activeCoupon && (
                                <span className="mini">(Cupom {coupon.percent_discount}%)</span>
                            )}
                        </span>
                        <span className='price-totals'>
                            <b>R$ {applyCouponDiscount(cartItems
                                    .reduce((total, item) => total + (item.pro_valorultimacompra * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                    .toFixed(2).replace('.',',')
                                }
                            </b>
                        </span>
                    </div>
                    <div className="totals discount">
                        <span>Total no Pix: 
                            <span className='mini'>({discountPix}% de desconto)</span>
                        </span>
                        <span className='price-totals c-red'>
                            <b>R$ {applyPixDiscount(cartItems
                                    .reduce((total, item) => total + (item.pro_valorultimacompra * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                    .toFixed(2).replace('.',',')
                                }
                            </b>
                        </span>
                    </div>
                    <div className="totals discount">
                        <span><b>Total à vista: </b></span>
                        <span className='price-totals'>
                            <b>R$ {applyDiscounts(cartItems
                                    .reduce((total, item) => total + (item.pro_valorultimacompra * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                    .toFixed(2).replace('.',',')
                                }
                            </b>
                        </span>
                    </div>
                    <a href="/checkout" className="link-to-buy">Finalizar Pedido</a>
                </div>
            </Box>
        </Drawer>
    );
}