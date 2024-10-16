"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CouponContextType, CouponShow } from '../interfaces/interfaces';

const CouponContext = createContext<CouponContextType>({
    statusMessage: '',
    activeCoupon: undefined,
    coupon: {
        id: 0,
        name: '',
        percent_discount: 1,
        prod_category: 0,
        exp_date: '1999-01-01',
    },
    setCouponFn: () => {},
});

export const CouponProvider = ({ children }) => {
    const [coupon, setCoupon] = useState<CouponShow | null>(null);
    const [activeCoupon, setActiveCoupon] = useState(undefined);
    const [statusMessage, setStatusMessage] = useState(undefined);

    useEffect(() => {
        if(localStorage.getItem('coupon') != null)
            setCoupon(JSON.parse(localStorage.getItem('coupon')))
    }, []);
    
    const setCouponFn = (coupon: CouponShow) => {
        setCoupon(coupon);
        if(new Date(coupon.exp_date).getTime() > new Date().getTime()) {
            setActiveCoupon(false);
            setStatusMessage('Cupom Expirado')
        }
        else {
            setActiveCoupon(true);
            setStatusMessage('Cupom aplicado com sucesso!')
        }
        localStorage.setItem('user', JSON.stringify(coupon));
    }

    return <CouponContext.Provider value={{ statusMessage, activeCoupon, coupon, setCouponFn }}>{children}</CouponContext.Provider>;
};


export const useCoupon = () => {
    return useContext(CouponContext);
};