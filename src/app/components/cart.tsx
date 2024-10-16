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

    const handleAlertRemoveItem = (id) => {
        openDialog('Tem certeza que deseja remover este produto?', '', 'Não', 'Sim', (confirm) =>  {
            if(confirm) {
                removeFromCart(id)
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
                {cartItems.length === 0 ? (
                    <p style={{textAlign: 'center', marginTop: '25px'}}>Carrinho vazio</p>
                ) : (
                    <>
                        {cartItems.map((item, index) => (
                            <div className="product" data-test={item.pro_codigo} key={item.pro_codigo}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <IconButton style={{padding: '0px'}} aria-label="delete" onClick={() => handleAlertRemoveItem(item.pro_codigo)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </div>
                                <Image
                                    src={HeadphoneImg}
                                    alt="HeadphoneImg"
                                    width={100}
                                />
                                <div className="name-qty">
                                    <span>{item.pro_descricao}</span>
                                    <div className="quantity">
                                        <button 
                                            type='button'
                                            onClick={() => handleDec(index, item.pro_codigo)}
                                            className="btn-qty decrement">-</button>
                                        <input value={cartData.find(i => i.id == item.pro_codigo).qty} min={min} max={max} onChange={(e) => handleInputChange(item, e)} type="number"/>
                                        <button 
                                            type='button'
                                            onClick={() => handleInc(index, item.pro_codigo)}
                                            className="btn-qty increment">+</button>
                                    </div>
                                </div>
                                <div className="product-price">
                                    <span className="price">
                                        <b>R$ {(item.pro_valorultimacompra * cartData.find(i => i.id == item.pro_codigo).qty).toFixed(2).toString().replace('.',',')}</b>
                                    </span>
                                </div>
                            </div>
                        ))}
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
                            <b>R$ {cartItems
                                    .reduce((total, item) => total + (item.pro_valorultimacompra * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0)
                                    .toFixed(2).replace('.',',')
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
                    <a href="#" className="link-to-buy">Finalizar Pedido</a>
                </div>
            </Box>
        </Drawer>
    );
}