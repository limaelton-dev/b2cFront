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
import { getAddressUser } from '../services/profile';
import { valorFrete } from '../services/checkout';
import { useAuth } from '../context/auth';

// Use try/catch para importar o hook, com fallback para a função direta
let useShippingCalculationImport;
try {
    useShippingCalculationImport = require('../checkout/hooks/useShippingCalculation').useShippingCalculation;
} catch (error) {
    console.warn('Erro ao importar hook useShippingCalculation, usando fallback:', error);
    useShippingCalculationImport = null;
}

export default function Cart({ cartOpened, onCartToggle }) {
    const { showToast } = useToastSide();
    const { openDialog } = useAlertDialog();
    const { user } = useAuth();
    const { statusMessage, activeCoupon, coupon, setCouponFn } = useCoupon();
    const { cartItems, cartData, changeQtyItem, removeFromCart } = useCart();
    const [inpCoupon, setInpCoupon] = useState<string>('');
    const [freteNome, setFreteNome] = useState<string>('');
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [frete, setFrete] = useState(0);
    const [errorCoupon, setErrorCoupon] = useState(false);
    const [discountPix, setDiscountPix] = useState(5);
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    
    // Implementação de um cálculo de frete local para fallback
    const calculateShippingFallback = async (zipCode, isAuthenticated, cartItems) => {
        try {
            if (isAuthenticated) {
                const response = await valorFrete(zipCode);
                if (response?.data?.data) {
                    return {
                        success: true,
                        name: 'PAC',
                        price: response.data.data.totalPreco,
                        deliveryTime: response.data.data.maiorPrazo
                    };
                }
            }
            return { success: false, error: 'Erro ao calcular frete' };
        } catch (error) {
            console.error('Erro no fallback do cálculo de frete:', error);
            return { success: false, error: 'Erro ao calcular frete' };
        }
    };
    
    // Usando o hook se estiver disponível ou o fallback
    const useShippingCalculationHook = useShippingCalculationImport ? useShippingCalculationImport() : { 
        calculateShipping: calculateShippingFallback,
        isLoadingShipping: false
    };
    
    const { calculateShipping, isLoadingShipping } = useShippingCalculationHook;

    const handleCloseCart = () => {
        onCartToggle(false);
    }

    const handleInc = (i, id) => {
        const d = cartData.find(item => item.id == id);
        if (d) {
            const currentQty = d.quantity;
            if (currentQty < max)
                changeQtyItem(id, currentQty + 1);
        }
    };
    
    const handleDec = (i, id) => {
        const d = cartData.find(item => item.id == id);
        if (d) {
            const currentQty = d.quantity;
            if (currentQty > min)
                changeQtyItem(id, currentQty - 1);
        }
    };

    const handleInputChange = (item, e) => {
        const newV = Number(e.target.value);
        const itemId = item.id;
        
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
        async function getAddress() {
            if(user && user.name) {
                try {
                    const resp = await getAddressUser();
                    if(resp && resp.length > 0 && resp[0] && resp[0].postal_code) {
                        // Usando o hook de cálculo de frete em vez da função direta
                        const cleanZipCode = resp[0].postal_code.replace(/\D/g, '');
                        // Formatar o CEP no padrão 99999-999
                        const formattedZipCode = cleanZipCode.length === 8 ? 
                            `${cleanZipCode.substring(0, 5)}-${cleanZipCode.substring(5)}` : 
                            cleanZipCode;
                        
                        const shippingResult = await calculateShipping(formattedZipCode, true, cartData);
                        
                        if (shippingResult && shippingResult.success) {
                            setFrete(shippingResult.price);
                            setFreteNome('PAC - até ' + shippingResult.deliveryTime + ' dias úteis');
                        }
                    }
                } catch (error) {
                    console.error("Erro ao obter endereço ou calcular frete:", error);
                    setFrete(0);
                }
            }
        }
        getAddress();
    }, [cartItems, user, calculateShipping, cartData]);

    // Verifica se os dados do carrinho estão sincronizados
    const isCartDataValid = () => {
        console.log(cartItems, cartData)
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return false;
        }
        if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
            return false;
        }
        
        // Verifica se todos os itens no cartData têm um produto correspondente em cartItems
        const allItemsValid = cartData.every(item => {
            if (!item) return false;
            
            const itemId = item.id || item.produto_id || item.productId;
            const hasMatchingProduct = cartItems.some(product => {
                if (!product) {
                    return false;
                }
                
                console.log(itemId, product.id)
                const match = product.id == itemId;
                
                return match;
            });
            
            if (!hasMatchingProduct) {
                console.log(`Nenhum produto correspondente encontrado para o item ${itemId}`);
            }
            
            return hasMatchingProduct;
        });
        return allItemsValid;
    };

    // Função para obter o preço correto do produto
    const getProductPrice = (product, item) => {
        if (!product || !item) {
            return 0;
        }
        
        const quantity = item.quantity || item.qty || 1;
        
        // Sempre usar o preço de venda do produto
        if (product.pro_precovenda && !isNaN(Number(product.pro_precovenda))) {
            return Number(product.pro_precovenda) * quantity;
        }
        
        return 0;
    };

    // Função para calcular o subtotal do carrinho
    const calculateSubtotal = () => {
        if (!cartData || !cartItems || cartData.length === 0 || cartItems.length === 0) {
            return 0;
        }
        
        return cartData.reduce((total, item) => {
            const itemId = item.id || item.productId;
            const product = cartItems.find(p => p && (p.id == itemId));
            
            if (product) {
                const price = getProductPrice(product, item);
                return total + (isNaN(price) ? 0 : price);
            }
            
            return total;
        }, 0);
    };

    // Função para obter a imagem do produto
    const getProductImage = (product) => {
        if (product.imagens && product.imagens.length > 0) {
            return product.imagens[0].url;
        }

        if (product.images && product.images.length > 0) {
            return product.images[0].url;
        }

        if (product.pro_imagem) {
            return product.pro_imagem;
        }
        
        return HeadphoneImg;
    };

    // Função para formatar o preço
    const formatPrice = (price) => {
        if (isNaN(price) || price === null || price === undefined) {
            return '0,00';
        }
        return price.toFixed(2).toString().replace('.', ',');
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
                            if (!item) return null;
                            
                            const itemId = item.productId || item.id;
                            
                            // Encontra o produto correspondente ao item do carrinho
                            const product = cartItems.find(r => r && (r.id == itemId));
                            // Se não encontrar o produto, pula este item
                            if (!product) {
                                console.error(`Produto com ID ${itemId} não encontrado no carrinho!`);
                                return <React.Fragment key={index}></React.Fragment>;
                            }
                            
                            // Obter nome do produto
                            const productName = product.name || product.pro_descricao || "Produto";
                            
                            return (
                                <div className="product" data-test={itemId} key={itemId || index}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                        <IconButton style={{padding: '0px'}} aria-label="delete" onClick={() => handleAlertRemoveItem(itemId)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                    <Image
                                        src={getProductImage(product)}
                                        alt={product.name || "Produto"}
                                        width={100}
                                        height={100}
                                        unoptimized={true}
                                    />
                                    <div className="name-qty">
                                        <Tooltip title={product.name}>
                                            <span>{limitaTexto(product.name, 36)}</span>
                                        </Tooltip>
                                        {product.brand && (
                                            <Typography variant="caption" color="text.secondary">
                                                Categoria: {product.brand.name}
                                            </Typography>
                                        )}
                                        {product.categoryLevel2 && (
                                            <Typography variant="caption" color="text.secondary">
                                                Categoria: {product.categoryLevel2.name}
                                            </Typography>
                                        )}
                                        <div className="quantity">
                                            <button 
                                                type='button'
                                                onClick={() => handleDec(index, itemId)}
                                                className="btn-qty decrement">-</button>
                                            <input value={item.quantity || item.qty || 1} min={min} max={max} onChange={(e) => handleInputChange(item, e)} type="number"/>
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
                                    <b>R$ {formatPrice(calculateSubtotal())}</b>
                                </span>
                            </div>
                            <div className="totals discount">
                                <span style={{height: '32px'}}>Descontos: 
                                    {activeCoupon && (
                                        <span className="mini">(Cupom {coupon.percent_discount}%)</span>
                                    )}
                                </span>
                                <span className='price-totals'>
                                    <b>R$ {formatPrice(applyCouponDiscount(calculateSubtotal()))}</b>
                                </span>
                            </div>
                            <div className="totals discount">
                                <span>Total no Pix: 
                                    <span className='mini'>({discountPix}% de desconto)</span>
                                </span>
                                <span className='price-totals c-red'>
                                    <b>R$ {formatPrice(applyPixDiscount(calculateSubtotal()))}</b>
                                </span>
                            </div>
                            <div className="totals discount">
                                <span>Entrega: 
                                    {user.name ? <span className='mini'>({freteNome})</span> : ''}
                                </span>
                                <span className='price-totals'>
                                    <b>R$ {frete.toFixed(2).replace('.',',') || '0,00'}</b>
                                </span>
                            </div>
                            <div className="totals discount">
                                <span><b>Total: </b></span>
                                <span className='price-totals'>
                                    <b>R$ {formatPrice(applyDiscounts(calculateSubtotal()) + frete)}</b>
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