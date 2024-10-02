import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Box, Divider, Drawer, IconButton } from '@mui/material';
import Image from 'next/image';
import HeadphoneImg from '../assets/img/headphone.png';
import { Close } from '@mui/icons-material';
import { useCart } from '../context/cart';

export default function Cart({ cartOpened, onCartToggle, changeAlertOpts }) {
    const { cartItems, itemQty, changeQtyItem, removeFromCart } = useCart();
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);

    const handleCloseCart = () => {
        onCartToggle(false);
    }

    const handleInc = (i) => {
        changeQtyItem(cartItems[i].pro_codigo, itemQty[i].qty + 1)
    };
    
    const handleDec = (i) => {
        changeQtyItem(cartItems[i].pro_codigo, itemQty[i].qty - 1)
    };

    const handleInputChange = (e, i) => {
        const newV = Number(e.target.value);
        itemQty[i].qty = newV;
    };

    const handleAlertRemoveItem = (id) => {
        removeFromCart(id)
        // changeAlertOpts({
        //     title: 'Tem certeja que deseja remover este item do carrinho?',
        //     desc: '',
        //     btnAgree: 'Ok',
        //     btnCancel: 'Cancelar',
        //     open: true
        // })
    }

    const calculateTotal = () => {
        return cartItems
          .reduce((total, item) => total + item.pro_valorultimacompra * item.pro_quantity, 0)
          .toFixed(2);
    };

    return (
        <Drawer open={cartOpened} anchor="right">
            <Box component="span" sx={{ width: '30vw' }} role="presentation">
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
                            <div className="product">
                                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                    <IconButton style={{padding: '0px'}} aria-label="delete" onClick={() => handleAlertRemoveItem(item.pro_codigo)}>
                                        <Close />
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
                                            onClick={() => handleDec(index)}
                                            className="btn-qty decrement">-</button>
                                        <input value={itemQty[index].qty} min={min} max={max} onChange={() => handleInputChange(this, item)} type="number"/>
                                        <button 
                                            type='button'
                                            onClick={() => handleInc(index)}
                                            className="btn-qty increment">+</button>
                                    </div>
                                </div>
                                <div className="product-price">
                                    <span className="price">
                                        <b>R$ {(item.pro_valorultimacompra * itemQty[index].qty).toFixed(2).toString().replace('.',',')}</b>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                </div>
                <Divider style={{background: 'gray'}}/>
                <div className="cart-totals">
                    <div className="totals">
                        <span>Total: </span>
                        <span className='price-totals'>
                            <b>R$ {cartItems
                                    .reduce((total, item) => total + (item.pro_valorultimacompra * itemQty[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0)
                                    .toFixed(2)
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