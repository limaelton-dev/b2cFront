import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Box, Button, Divider, Drawer, IconButton, TextField, Tooltip, Typography } from '@mui/material';
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
        const d = cartData.find(item => item.id == id || item.produto_id == id);
        if (d) {
            const currentQty = d.qty || d.quantity;
            if (currentQty < max)
                changeQtyItem(id, currentQty + 1);
        }
    };
    
    const handleDec = (i, id) => {
        const d = cartData.find(item => item.id == id || item.produto_id == id);
        if (d) {
            const currentQty = d.qty || d.quantity;
            if (currentQty > min)
                changeQtyItem(id, currentQty - 1);
        }
    };

    const handleInputChange = (item, e) => {
        const newV = Number(e.target.value);
        const itemId = item.id || item.produto_id;
        
        if(newV < min || newV > max) {
            if(newV < min) {
                changeQtyItem(itemId, min);
            }
            if(newV > max) {
                changeQtyItem(itemId, max);
            }
        } else {
            changeQtyItem(itemId, newV);
        }
    }

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
                if(removeFromCart(id)) {
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

    // Função para limitar o texto a um número específico de caracteres
    const limitaTexto = (text, maxLength = 36) => {
        return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    // Verifica se os dados do carrinho estão sincronizados
    const isCartDataValid = () => {
        
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return false;
        }
        if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
            return false;
        }
        
        // Verifica se todos os itens no cartData têm um produto correspondente em cartItems
        const allItemsValid = cartData.every(item => {
            const itemId = item.id || item.produto_id;
            
            const hasMatchingProduct = cartItems.some(product => {
                if (!product) {
                    console.log('Produto inválido encontrado em cartItems');
                    return false;
                }
                
                // Verificar correspondência pelo ID do produto ou pelo pro_codigo
                const matchById = product.id == itemId;
                const matchByProCodigo = product.pro_codigo == itemId;
                const match = matchById || matchByProCodigo;
                
                return match;
            });
            
            if (!hasMatchingProduct) {
                console.log(`Nenhum produto correspondente encontrado para o item ${itemId}`);
            }
            
            return hasMatchingProduct;
        });
        
        console.log('Todos os itens são válidos?', allItemsValid);
        return allItemsValid;
    };

    // Função para obter o preço correto do produto
    const getProductPrice = (product, item) => {
        // Sempre usar o preço de venda do produto
        if (product.pro_precovenda && !isNaN(product.pro_precovenda)) {
            return product.pro_precovenda * (item.qty || item.quantity);
        }
        
        // Se não tiver preço de venda, verificar se tem preço de última compra
        if (product.pro_precovenda && !isNaN(product.pro_precovenda)) {
            return product.pro_precovenda * (item.qty || item.quantity);
        }
        
        // Se nenhum preço válido for encontrado, retornar 0
        return 0;
    };

    // Função para calcular o subtotal do carrinho
    const calculateSubtotal = () => {
        return cartData.reduce((total, item) => {
            const itemId = item.id || item.produto_id;
            const product = cartItems.find(p => p && (p.id == itemId || p.pro_codigo == itemId));
            if (product) {
                return total + getProductPrice(product, item);
            }
            return total;
        }, 0);
    };

    // Função para obter a imagem do produto
    const getProductImage = (product) => {
        // Verificar se o produto tem imagens
        if (product.imagens && product.imagens.length > 0) {
            return product.imagens[0].url;
        }
        
        // Se não tiver imagens, verificar se tem pro_imagem
        if (product.pro_imagem) {
            return product.pro_imagem;
        }
        
        // Se não tiver nenhuma imagem, retornar a imagem padrão
        return HeadphoneImg;
    };

    // Função para formatar o preço
    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',');
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
                            const itemId = item.id || item.produto_id;
                            // Encontra o produto correspondente ao item do carrinho
                            const product = cartItems.find(r => r && (r.id == itemId || r.pro_codigo == itemId));
                            // Se não encontrar o produto, pula este item
                            if (!product) return <React.Fragment key={itemId}></React.Fragment>;
                            
                            return (
                                <div className="product" data-test={itemId} key={itemId}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                        <IconButton style={{padding: '0px'}} aria-label="delete" onClick={() => handleAlertRemoveItem(itemId)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                    <Image
                                        src={getProductImage(product)}
                                        alt={product.pro_descricao || "Produto"}
                                        width={100}
                                        height={100}
                                    />
                                    <div className="name-qty">
                                        <Tooltip title={product.pro_descricao}>
                                            <span>{limitaTexto(product.pro_descricao, 36)}</span>
                                        </Tooltip>
                                        {product.tipo && (
                                            <Typography variant="caption" color="text.secondary">
                                                Categoria: {product.tipo.tpo_descricao}
                                            </Typography>
                                        )}
                                        <div className="quantity">
                                            <button 
                                                type='button'
                                                onClick={() => handleDec(index, itemId)}
                                                className="btn-qty decrement">-</button>
                                            <input value={item.qty || item.quantity} min={min} max={max} onChange={(e) => handleInputChange(item, e)} type="number"/>
                                            <button 
                                                type='button'
                                                onClick={() => handleInc(index, itemId)}
                                                className="btn-qty increment">+</button>
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        <span className="price">
                                            <b>R$ {formatPrice(getProductPrice(product, item))}</b>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                </div>
                <div className="cart-moreprod">
                    <a
                        href='/produtos'
                        className='btn-buy-primary'
                        style={{
                            borderBottomLeftRadius: '0px',
                            borderTopLeftRadius: '0px',
                            borderRadius: '15px',
                            padding: '10px 4px',
                            width: '250px',
                            maxWidth: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            fontFamily: 'system-ui'
                        }}
                    >
                        {cartItems.length == 0 ? 'Veja todos os produtos' : 'Escolha mais produtos'}
                    </a>
                </div>
                {
                    cartItems.length != 0 ?
                    <>
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
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0)
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
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
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
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                            .toFixed(2).replace('.',',')
                                        }
                                    </b>
                                </span>
                            </div>
                            <div className="totals discount">
                                <span><b>Total à vista: </b></span>
                                <span className='price-totals'>
                                    <b>R$ {applyDiscounts(cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                            .toFixed(2).replace('.',',')
                                        }
                                    </b>
                                </span>
                            </div>
                            <a href="/checkout" className="link-to-buy">Finalizar Pedido</a>
                        </div>
                    </>
                    :
                    <>
                    </>
                }
            </Box>
        </Drawer>
    );
}