"use client";
import { useState, useCallback } from 'react';
import { CartItem } from '@/api/cart/types/Cart';
import { calculateShippingAuthenticated, calculateShippingGuest } from '@/api/checkout';

const PIX_DISCOUNT_PERCENT = 5;

export const useCheckoutPricing = (cartItems: CartItem[]) => {
    const [shippingName, setShippingName] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState(0);

    const calculateRawTotal = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = item.sku?.price ?? 0;
            return total + (price * item.quantity);
        }, 0);
    }, [cartItems]);

    const calculateSubtotal = useCallback(() => {
        return (calculateRawTotal() + shippingPrice).toFixed(2);
    }, [calculateRawTotal, shippingPrice]);

    const getPixDiscountedPrice = useCallback(() => {
        const subtotal = parseFloat(calculateSubtotal());
        const discounted = subtotal * (1 - PIX_DISCOUNT_PERCENT / 100);
        return discounted.toFixed(2).replace('.', ',');
    }, [calculateSubtotal]);

    const calculateShipping = useCallback(async (postalCode: string, isAuthenticated: boolean) => {
        if (!postalCode || postalCode.length !== 9) return;
        
        const cleanPostalCode = postalCode.replace('-', '');
        
        try {
            const response = isAuthenticated
                ? await calculateShippingAuthenticated(cleanPostalCode)
                : await calculateShippingGuest(cleanPostalCode, cartItems.map(item => ({
                    id: item.productId || item.skuId,
                    produto_id: item.productId || item.skuId,
                    quantity: item.quantity
                })));
            
            if (response?.success && response.data?.availableServices?.length) {
                const service = response.data.availableServices[0];
                setShippingName(service.serviceName);
                setShippingPrice(service.price);
                setDeliveryTime(service.deliveryTime);
            } else {
                setShippingName('');
                setShippingPrice(0);
                setDeliveryTime(0);
            }
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            setShippingName('');
            setShippingPrice(0);
            setDeliveryTime(0);
            throw error;
        }
    }, [cartItems]);
    
    return {
        shippingName,
        shippingPrice,
        deliveryTime,
        pixDiscount: PIX_DISCOUNT_PERCENT,
        calculateSubtotal,
        calculateRawTotal: useCallback(() => calculateRawTotal().toFixed(2).replace('.', ','), [calculateRawTotal]),
        getPixDiscountedPrice,
        calculateShipping
    };
};

