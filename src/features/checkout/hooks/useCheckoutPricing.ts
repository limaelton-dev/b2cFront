"use client";
import { useState, useCallback } from 'react';
import { CartItem } from '@/api/cart/types/Cart';
import { calculateShippingForCart, ShippingService } from '@/api/shipping';

const PIX_DISCOUNT_PERCENT = 5;

export const useCheckoutPricing = (cartItems: CartItem[]) => {
    const [shippingName, setShippingName] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState(0);
    const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);

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

    const calculateShipping = useCallback(async (postalCode: string, _isAuthenticated?: boolean) => {
        const cleanPostalCode = postalCode.replace(/\D/g, '');
        
        if (cleanPostalCode.length !== 8) return;

        const items = cartItems
            .filter(item => item.sku?.partnerId)
            .map(item => ({
                skuId: item.skuId,
                partnerId: item.sku?.partnerId || '',
                quantity: item.quantity
            }));

        if (!items.length) {
            setShippingName('');
            setShippingPrice(0);
            setDeliveryTime(0);
            setShippingServices([]);
            return;
        }

        try {
            const response = await calculateShippingForCart(cleanPostalCode, items);
            
            if (response?.success && response.services?.length) {
                setShippingServices(response.services);
                const service = response.services[0];
                setShippingName(service.serviceName);
                setShippingPrice(service.price);
                setDeliveryTime(service.deliveryDays);
            } else {
                setShippingName('');
                setShippingPrice(0);
                setDeliveryTime(0);
                setShippingServices([]);
            }
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            setShippingName('');
            setShippingPrice(0);
            setDeliveryTime(0);
            setShippingServices([]);
            throw error;
        }
    }, [cartItems]);
    
    return {
        shippingName,
        shippingPrice,
        shippingServices,
        deliveryTime,
        pixDiscount: PIX_DISCOUNT_PERCENT,
        calculateSubtotal,
        calculateRawTotal: useCallback(() => calculateRawTotal().toFixed(2).replace('.', ','), [calculateRawTotal]),
        getPixDiscountedPrice,
        calculateShipping
    };
};
